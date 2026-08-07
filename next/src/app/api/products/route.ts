import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { parsePagination } from "@/lib/pagination";
import { notFoundResponse } from "@/lib/api-response";
import {
  handleApiError,
  isErrorResponse,
  parseJsonWithSchema,
  requireAdmin,
  requireEditor,
  sanitizeTags,
} from "@/lib/api-utils";
import { ProductCreateSchema, ProductUpdateSchema, RequiredIdSchema } from "@/lib/validation";
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
      const session = await requireEditor();
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
    const session = await requireEditor();
    if (isErrorResponse(session)) return session;

    const prisma = getPrismaClient();
    const parsed = await parseJsonWithSchema(req, ProductCreateSchema);
    if (isErrorResponse(parsed)) return parsed;
    const {
      name,
      description,
      price,
      category,
      tags,
      image,
      images,
      stock,
      isPublished,
      isHeroImage,
      purchaseUrl,
    } = parsed;

    const product = await prisma.product.create({
      data: {
        name: xss(name),
        description: xss(description),
        price,
        category,
        tags: sanitizeTags(tags),
        image: image || null,
        images: images ?? Prisma.JsonNull,
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
    const session = await requireEditor();
    if (isErrorResponse(session)) return session;

    const prisma = getPrismaClient();
    const parsed = await parseJsonWithSchema(req, ProductUpdateSchema);
    if (isErrorResponse(parsed)) return parsed;
    const {
      id,
      name,
      description,
      price,
      category,
      tags,
      image,
      images,
      stock,
      isPublished,
      isHeroImage,
      purchaseUrl,
    } = parsed;

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
        images: images !== undefined ? (images ?? Prisma.JsonNull) : undefined,
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
    const session = await requireAdmin();
    if (isErrorResponse(session)) return session;

    const prisma = getPrismaClient();
    const parsed = await parseJsonWithSchema(req, RequiredIdSchema);
    if (isErrorResponse(parsed)) return parsed;
    const { id } = parsed;

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
