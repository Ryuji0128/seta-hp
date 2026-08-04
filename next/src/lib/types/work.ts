// Prisma の Work モデルに対応する共有型。
// API レスポンス（JSON化された Date）とサーバー取得（Date）の両方を受けられるよう
// createdAt は string | Date にしている（product.ts と同方針）。
export interface Work {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string;
  image: string | null;
  isPublished: boolean;
  createdAt: string | Date;
}

/** ギャラリー一覧カードで使うサブセット */
export type WorkGridItem = Pick<Work, "id" | "title" | "category" | "image" | "createdAt">;
