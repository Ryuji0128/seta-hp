import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import { auth } from "@/lib/auth";

// 許可されたカテゴリ
const VALID_CATEGORIES = ["3dprint", "lasercut"];
const VALID_STOCKS = ["在庫あり", "残りわずか", "受注生産", "売り切れ"];

// 商品一覧取得（公開用）
export async function GET(req: NextRequest) {
  try {
    const prisma = getPrismaClient();
    const { searchParams } = new URL(req.url);
    const includeUnpublished = searchParams.get("includeUnpublished") === "true";

    // 認証チェック（非公開商品を含める場合）
    if (includeUnpublished) {
      const session = await auth();
      if (!session) {
        return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
      }
    }

    const products = await prisma.product.findMany({
      where: includeUnpublished ? {} : { isPublished: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("商品取得エラー:", error);
    return NextResponse.json({ error: "商品の取得に失敗しました" }, { status: 500 });
  }
}

// 商品作成
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const userRole = (session?.user as { role?: string })?.role;
    if (userRole !== "ADMIN" && userRole !== "EDITOR") {
      return NextResponse.json({ error: "編集権限が必要です" }, { status: 403 });
    }

    const prisma = getPrismaClient();
    const body = await req.json();
    const { name, description, price, category, tags, image, stock, isPublished } = body;

    if (!name || !description || price === undefined || !category) {
      return NextResponse.json({ error: "名前、説明、価格、カテゴリは必須です" }, { status: 400 });
    }

    // 価格の検証
    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum < 0) {
      return NextResponse.json({ error: "価格は0以上の数値を指定してください" }, { status: 400 });
    }

    // カテゴリの検証
    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: `カテゴリは${VALID_CATEGORIES.join(", ")}のいずれかを指定してください` }, { status: 400 });
    }

    // 在庫状況の検証
    if (stock && !VALID_STOCKS.includes(stock)) {
      return NextResponse.json({ error: `在庫状況は${VALID_STOCKS.join(", ")}のいずれかを指定してください` }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: priceNum,
        category,
        tags: Array.isArray(tags) ? tags.join(",") : tags || "",
        image: image || null,
        stock: stock || "在庫あり",
        isPublished: isPublished !== false,
      },
    });

    return NextResponse.json({ message: "商品を作成しました", product });
  } catch (error) {
    console.error("商品作成エラー:", error);
    return NextResponse.json({ error: "商品の作成に失敗しました" }, { status: 500 });
  }
}

// 商品更新
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const userRole = (session?.user as { role?: string })?.role;
    if (userRole !== "ADMIN" && userRole !== "EDITOR") {
      return NextResponse.json({ error: "編集権限が必要です" }, { status: 403 });
    }

    const prisma = getPrismaClient();
    const body = await req.json();
    const { id, name, description, price, category, tags, image, stock, isPublished } = body;

    if (!id) {
      return NextResponse.json({ error: "IDは必須です" }, { status: 400 });
    }

    // 存在確認
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "指定された商品が見つかりません" }, { status: 404 });
    }

    // 価格の検証
    let priceNum: number | undefined;
    if (price !== undefined) {
      priceNum = Number(price);
      if (isNaN(priceNum) || priceNum < 0) {
        return NextResponse.json({ error: "価格は0以上の数値を指定してください" }, { status: 400 });
      }
    }

    // カテゴリの検証
    if (category && !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: `カテゴリは${VALID_CATEGORIES.join(", ")}のいずれかを指定してください` }, { status: 400 });
    }

    // 在庫状況の検証
    if (stock && !VALID_STOCKS.includes(stock)) {
      return NextResponse.json({ error: `在庫状況は${VALID_STOCKS.join(", ")}のいずれかを指定してください` }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: priceNum,
        category,
        tags: Array.isArray(tags) ? tags.join(",") : tags,
        image: image || null,
        stock,
        isPublished,
      },
    });

    return NextResponse.json({ message: "商品を更新しました", product });
  } catch (error) {
    console.error("商品更新エラー:", error);
    return NextResponse.json({ error: "商品の更新に失敗しました" }, { status: 500 });
  }
}

// 商品削除
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const userRole = (session?.user as { role?: string })?.role;
    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 });
    }

    const prisma = getPrismaClient();
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "IDは必須です" }, { status: 400 });
    }

    // 存在確認
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "指定された商品が見つかりません" }, { status: 404 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "商品を削除しました" });
  } catch (error) {
    console.error("商品削除エラー:", error);
    return NextResponse.json({ error: "商品の削除に失敗しました" }, { status: 500 });
  }
}
