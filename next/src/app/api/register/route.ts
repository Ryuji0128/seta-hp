import { NextRequest } from "next/server";
import { getPrismaClient } from "@/lib/db";
import bcryptjs from "bcryptjs";
import { badRequestResponse, successResponse } from "@/lib/api-response";
import {
  handleApiError,
  isErrorResponse,
  parseJsonWithSchema,
} from "@/lib/api-utils";
import { enforceRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { DEFAULT_USER_ROLE } from "@/lib/roles";
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
      select: { id: true },
    });

    if (existingUser) {
      return badRequestResponse("アカウントの作成に失敗しました");
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcryptjs.hash(validatedData.password, 12);

    // ユーザーの作成
    await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: DEFAULT_USER_ROLE,
      },
      select: { id: true },
    });

    return successResponse({
      status: 201,
      headers: {
        "X-RateLimit-Remaining": String(rateLimitResult.remaining),
        "X-RateLimit-Reset": String(rateLimitResult.resetAt),
      },
    });
  } catch (error) {
    return handleApiError(error, {
      log: "Registration error",
      message: "アカウントの作成に失敗しました",
      uniqueConstraintMessage: "アカウントの作成に失敗しました",
    });
  }
}
