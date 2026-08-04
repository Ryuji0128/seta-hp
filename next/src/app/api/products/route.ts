import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { parsePagination } from "@/lib/pagination";
import { badRequestResponse, notFoundResponse } from "@/lib/api-response";
import { handleApiError, isErrorResponse, parseJsonBody, requireRole, sanitizeTags } from "@/lib/api-utils";
import { ProductCreateSchema, ProductUpdateSchema } from "@/lib/validation";
import { collectImageUrls, deleteUnusedUploadedFiles } from "@/lib/uploaded-files";
import { revalidateProductPages } from "@/lib/cache-tags";
import xss from "xss";

// 商品一覧取得（公開用）
export async function GET(req: NextRequest) {
  try {
    const prisma = getPrismaClient();
    const { searchParams } = new URL(req.url);
    const includeUnpublished = searchParams.get("includeUnpublished") === "true";

    // 認証・権限チェック（非公開商品を含める場合はADMIN/EDITORのみ）
    if (includeUnpublished) {
      const session = await requireRole(["ADMIN", "EDITOR"], "編集権限が必要です");
      if (isErrorResponse(session)) return session;
    }

    const { page, limit, skip } = parsePagination(searchParams);

    const where = includeUnpublished ? {} : { isPublished: true };
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({ products, total, page, limit });
  } catch (error) {
    return handleApiError(error, { log: "商品取得エラー", message: "商品の取得に失敗しました" });
  }
}

// 商品作成
export async function POST(req: NextRequest) {
  try {
    const session = await requireRole(["ADMIN", "EDITOR"], "編集権限が必要です");
    if (isErrorResponse(session)) return session;

    const prisma = getPrismaClient();
    const body = await parseJsonBody(req);
    if (isErrorResponse(body)) return body;

    // バリデーションは Zod スキーマに集約（価格の整数チェック・カテゴリ/在庫/URL検証を含む）
    const parsed = ProductCreateSchema.safeParse(body);
    if (!parsed.success) {
      return badRequestResponse(parsed.error.errors[0].message);
    }
    const { name, description, price, category, stock, purchaseUrl } = parsed.data;
    const { tags, image, images, isPublished, isHeroImage } = body;

    const product = await prisma.product.create({
      data: {
        name: xss(name),
        description: xss(description),
        price,
        category,
        tags: sanitizeTags(tags),
        image: image || null,
        images: Array.isArray(images) ? images : Prisma.JsonNull,
        stock: stock || "在庫あり",
        isPublished: isPublished !== false,
        isHeroImage: isHeroImage === true,
        purchaseUrl: purchaseUrl ? xss(purchaseUrl) : null,
      },
    });

    revalidateProductPages();

    return NextResponse.json({ message: "商品を作成しました", product });
  } catch (error) {
    return handleApiError(error, { log: "商品作成エラー", message: "商品の作成に失敗しました" });
  }
}

// 商品更新
export async function PUT(req: NextRequest) {
  try {
    const session = await requireRole(["ADMIN", "EDITOR"], "編集権限が必要です");
    if (isErrorResponse(session)) return session;

    const prisma = getPrismaClient();
    const body = await parseJsonBody(req);
    if (isErrorResponse(body)) return body;

    // バリデーションは Zod スキーマに集約（POST と共通・全フィールド任意 + ID 必須）
    const parsed = ProductUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return badRequestResponse(parsed.error.errors[0].message);
    }
    const { id, name, description, price, category, stock, purchaseUrl } = parsed.data;
    const { tags, image, images, isPublished, isHeroImage } = body;

    // 存在確認
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return notFoundResponse("指定された商品が見つかりません");
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: name ? xss(name) : undefined,
        description: description ? xss(description) : undefined,
        price,
        category,
        tags: tags !== undefined ? sanitizeTags(tags) : undefined,
        image: image !== undefined ? (image || null) : undefined,
        images: images !== undefined ? (Array.isArray(images) ? images : Prisma.JsonNull) : undefined,
        stock,
        isPublished,
        isHeroImage: isHeroImage !== undefined ? isHeroImage === true : undefined,
        purchaseUrl: purchaseUrl !== undefined ? (purchaseUrl ? xss(purchaseUrl) : null) : undefined,
      },
    });

    await deleteUnusedUploadedFiles(prisma, collectImageUrls(existing));

    revalidateProductPages();

    return NextResponse.json({ message: "商品を更新しました", product });
  } catch (error) {
    return handleApiError(error, {
      log: "商品更新エラー",
      message: "商品の更新に失敗しました",
      notFoundMessage: "指定された商品が見つかりません",
    });
  }
}

// 商品削除
export async function DELETE(req: NextRequest) {
  try {
    const session = await requireRole(["ADMIN"], "管理者権限が必要です");
    if (isErrorResponse(session)) return session;

    const prisma = getPrismaClient();
    const body = await parseJsonBody(req);
    if (isErrorResponse(body)) return body;
    const { id } = body;

    if (!id) {
      return badRequestResponse("IDは必須です");
    }

    // 存在確認
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return notFoundResponse("指定された商品が見つかりません");
    }

    await prisma.product.delete({
      where: { id },
    });

    await deleteUnusedUploadedFiles(prisma, collectImageUrls(existing));

    revalidateProductPages();

    return NextResponse.json({ message: "商品を削除しました" });
  } catch (error) {
    return handleApiError(error, {
      log: "商品削除エラー",
      message: "商品の削除に失敗しました",
      notFoundMessage: "指定された商品が見つかりません",
    });
  }
}
