import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import Stripe from "stripe";

const MAX_AMOUNT = 1_000_000; // 月額100万円

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-12-15.clover",
  });
}

export async function POST(request: NextRequest) {
  try {
    // レート制限チェック（公開エンドポイント）
    const clientIp = getClientIp(request);
    const rateLimitResult = checkRateLimit(`checkout:${clientIp}`, RATE_LIMITS.api);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "リクエスト回数が上限に達しました。しばらくお待ちください。" },
        { status: 429 }
      );
    }

    const { amount, productName } = await request.json();

    if (!amount || amount < 100 || amount > MAX_AMOUNT) {
      return NextResponse.json(
        { error: `100円以上${MAX_AMOUNT.toLocaleString()}円以下を指定してください` },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const name = productName || "瀬田製作所 - 月額サブスクリプション";
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: {
              name: name,
              description: `月額¥${amount.toLocaleString()}のサブスクリプション`,
            },
            unit_amount: amount,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json(
      { error: "サブスクリプションセッションの作成に失敗しました" },
      { status: 500 }
    );
  }
}
