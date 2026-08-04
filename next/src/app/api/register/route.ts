import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import bcryptjs from "bcryptjs";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { isErrorResponse, parseJsonBody } from "@/lib/api-utils";
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

    const body = await parseJsonBody(request);
    if (isErrorResponse(body)) return body;
    const validatedData = RegistrationSchema.parse(body);

    // 既存ユーザーのチェック
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "アカウントの作成に失敗しました" },
        { status: 400 }
      );
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
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    // 同時登録による一意制約違反は既存ユーザーと同じ応答にする（事前チェックとのTOCTOU対策）
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "アカウントの作成に失敗しました" },
        { status: 400 }
      );
    }
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "アカウントの作成に失敗しました" },
      { status: 500 }
    );
  }
}
