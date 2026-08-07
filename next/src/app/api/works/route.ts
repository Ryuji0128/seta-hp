import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
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
import { RequiredIdSchema, WorkCreateSchema, WorkUpdateSchema } from "@/lib/validation";
import { collectImageUrls, deleteUnusedUploadedFiles } from "@/lib/uploaded-files";
import { revalidateWorkPages } from "@/lib/cache-tags";
import xss from "xss";

// 制作事例一覧取得（公開用）
export async function GET(req: NextRequest) {
  try {
    const prisma = getPrismaClient();
    const { searchParams } = new URL(req.url);
    const includeUnpublished = searchParams.get("includeUnpublished") === "true";

    // 認証・権限チェック（非公開を含める場合はADMIN/EDITORのみ）
    if (includeUnpublished) {
      const session = await requireEditor();
      if (isErrorResponse(session)) return session;
    }

    const { page, limit, skip } = parsePagination(searchParams);

    const where = includeUnpublished ? {} : { isPublished: true };
    const [works, total] = await Promise.all([
      prisma.work.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          tags: true,
          image: true,
          isPublished: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      prisma.work.count({ where }),
    ]);

    return NextResponse.json({ works, total, page, limit });
  } catch (error) {
    return handleApiError(error, { log: "制作事例取得エラー", message: "制作事例の取得に失敗しました" });
  }
}

// 制作事例作成
export async function POST(req: NextRequest) {
  try {
    const session = await requireEditor();
    if (isErrorResponse(session)) return session;

    const prisma = getPrismaClient();
    const parsed = await parseJsonWithSchema(req, WorkCreateSchema);
    if (isErrorResponse(parsed)) return parsed;
    const { title, description, category, tags, image, isPublished } = parsed;

    const work = await prisma.work.create({
      data: {
        title: xss(title),
        description: xss(description),
        category,
        tags: sanitizeTags(tags),
        image: image || null,
        isPublished: isPublished !== false,
      },
    });

    revalidateWorkPages();

    return NextResponse.json({ message: "制作事例を作成しました", work });
  } catch (error) {
    return handleApiError(error, { log: "制作事例作成エラー", message: "制作事例の作成に失敗しました" });
  }
}

// 制作事例更新
export async function PUT(req: NextRequest) {
  try {
    const session = await requireEditor();
    if (isErrorResponse(session)) return session;

    const prisma = getPrismaClient();
    const parsed = await parseJsonWithSchema(req, WorkUpdateSchema);
    if (isErrorResponse(parsed)) return parsed;
    const { id, title, description, category, tags, image, isPublished } = parsed;

    // 存在確認
    const existing = await prisma.work.findUnique({ where: { id } });
    if (!existing) {
      return notFoundResponse("指定された制作事例が見つかりません");
    }

    const work = await prisma.work.update({
      where: { id },
      data: {
        title: title ? xss(title) : undefined,
        description: description ? xss(description) : undefined,
        category,
        tags: tags !== undefined ? sanitizeTags(tags) : undefined,
        image: image !== undefined ? (image || null) : undefined,
        isPublished,
      },
    });

    await deleteUnusedUploadedFiles(prisma, collectImageUrls(existing));

    revalidateWorkPages();

    return NextResponse.json({ message: "制作事例を更新しました", work });
  } catch (error) {
    return handleApiError(error, {
      log: "制作事例更新エラー",
      message: "制作事例の更新に失敗しました",
      notFoundMessage: "指定された制作事例が見つかりません",
    });
  }
}

// 制作事例削除
export async function DELETE(req: NextRequest) {
  try {
    const session = await requireAdmin();
    if (isErrorResponse(session)) return session;

    const prisma = getPrismaClient();
    const parsed = await parseJsonWithSchema(req, RequiredIdSchema);
    if (isErrorResponse(parsed)) return parsed;
    const { id } = parsed;

    // 存在確認
    const existing = await prisma.work.findUnique({ where: { id } });
    if (!existing) {
      return notFoundResponse("指定された制作事例が見つかりません");
    }

    await prisma.work.delete({
      where: { id },
    });

    await deleteUnusedUploadedFiles(prisma, collectImageUrls(existing));

    revalidateWorkPages();

    return NextResponse.json({ message: "制作事例を削除しました" });
  } catch (error) {
    return handleApiError(error, {
      log: "制作事例削除エラー",
      message: "制作事例の削除に失敗しました",
      notFoundMessage: "指定された制作事例が見つかりません",
    });
  }
}
