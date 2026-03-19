import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import bcryptjs from "bcryptjs";
import { z } from "zod";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";

const prisma = getPrismaClient();

// パスワード強度チェック
const passwordSchema = z
  .string()
  .min(8, "パスワードは8文字以上で入力してください")
  .regex(/[a-zA-Z]/, "パスワードには英字を含めてください")
  .regex(/[0-9]/, "パスワードには数字を含めてください");

const RegisterSchema = z.object({
  name: z
    .string()
    .min(1, "名前を入力してください")
    .max(50, "名前は50文字以内で入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: passwordSchema,
});

export async function POST(request: NextRequest) {
  try {
    // レートリミットチェック
    const clientIp = getClientIp(request);
    const rateLimitResult = checkRateLimit(
      `register:${clientIp}`,
      RATE_LIMITS.register
    );

    if (!rateLimitResult.success) {
      const retryAfter = Math.ceil(
        (rateLimitResult.resetAt - Date.now()) / 1000
      );
      return NextResponse.json(
        {
          error: "登録の試行回数が上限に達しました。しばらく時間をおいてからお試しください。",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(rateLimitResult.resetAt),
          },
        }
      );
    }

    const body = await request.json();
    const validatedData = RegisterSchema.parse(body);

    // 既存ユーザーのチェック
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "このメールアドレスは既に登録されています" },
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
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "アカウントの作成に失敗しました" },
      { status: 500 }
    );
  }
}
