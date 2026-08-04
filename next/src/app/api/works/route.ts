import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import { parsePagination } from "@/lib/pagination";
import { badRequestResponse, notFoundResponse } from "@/lib/api-response";
import { handleApiError, isErrorResponse, parseJsonBody, requireRole, sanitizeTags } from "@/lib/api-utils";
import { WorkCreateSchema, WorkUpdateSchema } from "@/lib/validation";
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
      const session = await requireRole(["ADMIN", "EDITOR"], "編集権限が必要です");
      if (isErrorResponse(session)) return session;
    }

    const { page, limit, skip } = parsePagination(searchParams);

    const where = includeUnpublished ? {} : { isPublished: true };
    const [works, total] = await Promise.all([
      prisma.work.findMany({
        where,
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
    const session = await requireRole(["ADMIN", "EDITOR"], "編集権限が必要です");
    if (isErrorResponse(session)) return session;

    const prisma = getPrismaClient();
    const body = await parseJsonBody(req);
    if (isErrorResponse(body)) return body;

    // バリデーションは Zod スキーマに集約
    const parsed = WorkCreateSchema.safeParse(body);
    if (!parsed.success) {
      return badRequestResponse(parsed.error.errors[0].message);
    }
    const { title, description, category } = parsed.data;
    const { tags, image, isPublished } = body;

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
    const session = await requireRole(["ADMIN", "EDITOR"], "編集権限が必要です");
    if (isErrorResponse(session)) return session;

    const prisma = getPrismaClient();
    const body = await parseJsonBody(req);
    if (isErrorResponse(body)) return body;

    // バリデーションは Zod スキーマに集約（POST と共通・全フィールド任意 + ID 必須）
    const parsed = WorkUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return badRequestResponse(parsed.error.errors[0].message);
    }
    const { id, title, description, category } = parsed.data;
    const { tags, image, isPublished } = body;

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
