import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import bcryptjs from "bcryptjs";
import { badRequestResponse } from "@/lib/api-response";
import {
  handleApiError,
  isErrorResponse,
  parseJsonWithSchema,
} from "@/lib/api-utils";
import { enforceRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { RegistrationSchema } from "@/lib/validation";

const prisma = getPrismaClient();

export async function POST(request: NextRequest) {
  try {
    // レートリミットチェック
    const { limited, result: rateLimitResult } = await enforceRateLimit(
      request,
      "register",
      RATE_LIMITS.register,
      "登録の試行回数が上限に達しました。しばらく時間をおいてからお試しください。"
    );
    if (limited) return limited;

    const validatedData = await parseJsonWithSchema(request, RegistrationSchema);
    if (isErrorResponse(validatedData)) return validatedData;

    // 既存ユーザーのチェック
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return badRequestResponse("アカウントの作成に失敗しました");
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcryptjs.hash(validatedData.password, 12);

    // ユーザーの作成
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: "VIEWER", // 一般ユーザーはVIEWER
      },
    });

    return NextResponse.json(
      {
        message: "アカウントを作成しました",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      {
        status: 201,
        headers: {
          "X-RateLimit-Remaining": String(rateLimitResult.remaining),
          "X-RateLimit-Reset": String(rateLimitResult.resetAt),
        },
      }
    );
  } catch (error) {
    return handleApiError(error, {
      log: "Registration error",
      message: "アカウントの作成に失敗しました",
      uniqueConstraintMessage: "アカウントの作成に失敗しました",
    });
  }
}
