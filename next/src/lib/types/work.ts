import type { Work as PrismaWork } from "@prisma/client";

// DB直取得（Date）とAPIレスポンス（ISO文字列）の両方を受けつつ、
// モデルのフィールド追加・変更はPrisma型へ追従する。
export type Work = Omit<PrismaWork, "createdAt" | "updatedAt"> & {
  createdAt: string | Date;
};

/** ギャラリー一覧カードで使うサブセット */
export type WorkGridItem = Pick<Work, "id" | "title" | "category" | "image" | "createdAt">;
