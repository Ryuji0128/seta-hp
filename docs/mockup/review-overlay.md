# Review Overlay 移植ガイド

社内レビュー用のページ内コメント機能を別のNext.jsプロジェクトへ移植する際の構成メモです。実装コードの複製は置かず、このリポジトリ内の現行ファイルを正本とします。

## 機能

- ページ上の座標をクリックしてコメントを作成
- 返信、解決・再オープン、コメント・返信の削除
- コメント一覧ドロワーと未解決件数表示
- 投稿者名をlocalStorageへ保存
- `NEXT_PUBLIC_ENABLE_COMMENTS=true` の環境だけUIとAPIを有効化
- DB共有レート制限。`RATE_LIMIT_STORE=memory` への切り替えも可能

認証機能はありません。有効化した環境へアクセスできる利用者全員が読み書きできるため、社内環境または別のアクセス制御配下でのみ使用してください。

## 現行ファイル

| 役割 | 正本 |
| --- | --- |
| UI統括 | `next/src/components/ReviewOverlay.tsx` |
| 分割UI | `next/src/components/review/` |
| API有効化・入力・レート制限ガード | `next/src/lib/reviewCommentsGuard.ts` |
| Prisma select共通定義 | `next/src/lib/review-comment-query.ts` |
| 共有レート制限 | `next/src/lib/rate-limit.ts` |
| 一覧・作成API | `next/src/app/api/review-comments/route.ts` |
| 更新・削除API | `next/src/app/api/review-comments/[id]/route.ts` |
| 返信API | `next/src/app/api/review-comments/[id]/replies/route.ts` |
| DBモデル | `next/prisma/schema.prisma` |
| ルートへのマウント | `next/src/app/layout.tsx` |

## 環境変数

`next/.env` またはデプロイ環境へ次を設定します。

```dotenv
NEXT_PUBLIC_ENABLE_COMMENTS=true
# 任意。省略時はDATABASE_URLがあればdatabase、テスト時はmemory
RATE_LIMIT_STORE=database
```

フラグを外すとUIはマウントされず、Review APIは404を返します。公開環境での誤設定を避けるため、本番用envには追加しない運用を推奨します。

## DBモデル

現行データ契約は次のとおりです。ピン位置は幅比率とページ上端からの絶対Y座標だけを保存します。旧 `elementSelector` と未使用の `updatedAt` は使用しません。

```prisma
model ReviewComment {
  id         Int                  @id @default(autoincrement())
  createdAt  DateTime             @default(now())
  pageUrl    String
  xRatio     Float
  yAbsolute  Float
  authorName String
  content    String               @db.Text
  status     String               @default("open")
  replies    ReviewCommentReply[]

  @@index([pageUrl])
}

model ReviewCommentReply {
  id         Int           @id @default(autoincrement())
  createdAt  DateTime      @default(now())
  commentId  Int
  comment    ReviewComment @relation(fields: [commentId], references: [id], onDelete: Cascade)
  authorName String
  content    String        @db.Text

  @@index([commentId])
}
```

本番相当環境では `prisma db push` ではなくmigrationを作成し、空DBから `prisma migrate deploy` できることを確認します。

## API契約

```text
GET    /api/review-comments?page=<pathname>
POST   /api/review-comments
       { pageUrl, authorName, content, xRatio, yAbsolute }
PATCH  /api/review-comments/:id
       { status: "open" | "resolved" }
DELETE /api/review-comments/:id
POST   /api/review-comments/:id/replies
       { authorName, content }
DELETE /api/review-comments/:id/replies?replyId=<id>
```

返信削除は必ずURLのcommentIdとreplyIdの組で絞ります。入力長、座標、ID、XSSサニタイズ、レート制限は `reviewCommentsGuard.ts` の定義を正本にしてください。

## UI組み込み

ルートレイアウトのThemeProvider内で、フラグが有効な場合だけマウントします。

```tsx
{process.env.NEXT_PUBLIC_ENABLE_COMMENTS === "true" && <ReviewOverlay />}
```

ページ遷移時は進行中の一覧取得をAbortControllerで中止し、前ページのピンを即時クリアします。この処理を外すと遅いレスポンスが新しいページを上書きします。

## 移植チェック

1. Prismaモデルとmigrationを追加する。
2. API、guard、query select、rate limitを移植する。
3. Review UI一式を移植し、MUI ThemeProvider内へマウントする。
4. 環境変数を社内環境だけに設定する。
5. コメント作成、返信、状態切替、各削除を確認する。
6. ページ遷移中に前ページのピンが残らないことを確認する。
7. フラグ未設定時にUIがなく、APIが404になることを確認する。
8. 別端末から同じコメントが見えることを確認する。

## 制約

- ピンは座標固定のため、大幅なレスポンシブレイアウト変更では位置がずれる場合があります。
- 投稿者名は自己申告で、ユーザー認証とは結び付きません。
- UIはMUI依存です。別UI基盤へ移植する場合もAPI契約とDBモデルはそのまま利用できます。
