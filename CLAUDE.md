# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

瀬田製作所が運営するハンドメイド製品ECサイト「SETA Craft」。Next.js 15 (App Router) + MUI + Prisma + MySQL で構成されたフルスタックWebアプリケーション。

## Tech Stack

- **Frontend**: Next.js 15, React 19, MUI v6, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, NextAuth.js v5 (JWT + Credentials / Google OAuth)
- **Database**: MySQL 8.0, Prisma ORM
- **Deployment**: Docker, Nginx, GitHub Actions, Google App Engine
- **Other**: Stripe決済, reCAPTCHA v3, Nodemailer, Zod

## Project Structure

```
seta-hp/
├── next/                    # Next.jsアプリケーション
│   ├── src/
│   │   ├── app/             # App Router pages & API routes
│   │   ├── components/      # 共有コンポーネント
│   │   ├── lib/             # ユーティリティ
│   │   │   ├── constants/   # カテゴリ・在庫定義
│   │   │   ├── api-response.ts  # APIレスポンスヘルパー
│   │   │   ├── rate-limit.ts    # レート制限（統一済み）
│   │   │   ├── validation.ts    # Zodバリデーション（統一済み）
│   │   │   ├── auth.ts          # NextAuth初期化
│   │   │   └── db.ts            # Prismaクライアント
│   │   ├── actions/         # Server Actions
│   │   └── theme/           # MUIテーマ設定
│   ├── auth.config.ts       # NextAuth設定（providers, callbacks）
│   ├── prisma/              # Prismaスキーマ & シード
│   └── public/              # 静的ファイル
├── docker-compose.dev.yml   # 開発環境
├── docker-compose.yml       # 本番環境
└── nginx/                   # Nginx設定
```

## Development Commands

```bash
# Docker開発環境の起動
docker compose -f docker-compose.dev.yml up

# 個別コマンド (nextディレクトリで実行)
cd next
yarn dev              # 開発サーバー (Turbopack)
yarn build            # ビルド + sitemap生成
yarn lint             # ESLint
npx tsc --noEmit      # 型チェック

# Prisma
npx prisma generate   # Clientの生成
npx prisma db push    # スキーマをDBに反映
npx prisma studio     # DB GUIツール
npx prisma db seed    # シードデータ投入
```

## Key Pages

### 公開ページ

| Path | Description |
|------|-------------|
| `/` | トップページ (Hero, カテゴリ, 特集商品, 工房紹介, CTA) |
| `/products` | 商品一覧 |
| `/products/[id]` | 商品詳細 |
| `/gallery` | ギャラリー |
| `/about` | SETA Craftについて |
| `/company` | 会社情報（瀬田製作所） |
| `/contact` | お問い合わせフォーム |
| `/shipping` | 配送について |
| `/legal` | 特定商取引法に基づく表記 |
| `/privacy-policy` | プライバシーポリシー |
| `/login` | ログイン |
| `/register` | ユーザー登録 |

### 管理ページ（認証必要: ADMIN/EDITOR）

| Path | Description |
|------|-------------|
| `/products-manage` | 商品管理 |
| `/gallery-manage` | ギャラリー管理 |
| `/works-manage` | 実績管理 |
| `/news` | ニュース管理 |
| `/estimates` | 見積管理 |

## Database Models

- **User**: ユーザー (ADMIN/EDITOR/VIEWER roles, cuid ID)
- **Product**: 商品 (名前, 価格, カテゴリ, 複数画像 Json, 在庫状況, 公開フラグ)
- **Work**: 実績・ポートフォリオ
- **News**: ニュース記事 (日付, タイトル, JSON contents)
- **Inquiry**: お問い合わせ
- **Estimate**: 見積書 (PDF, 金額, Stripe決済状態)
- **Account/Session**: NextAuth認証関連

## Environment Variables

開発環境は `next/.env` に設定。主要な変数:
- `DATABASE_URL`: MySQL接続文字列
- `AUTH_SECRET` / `NEXTAUTH_SECRET`: NextAuth暗号化キー
- `NEXTAUTH_URL`: 認証コールバックURL
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: Google OAuth（任意）
- `STRIPE_SECRET_KEY`: Stripe秘密鍵
- `RECAPTCHA_SECRET_KEY`: reCAPTCHA検証用
- `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS`: メール送信

## Critical Patterns

### API Routes
- `/api/auth/[...nextauth]`: NextAuth認証エンドポイント
- `/api/products`: 商品CRUD（GET公開, 書込ADMIN/EDITOR, 非公開取得ADMIN/EDITOR）
- `/api/email`: お問い合わせメール送信（レート制限あり）
- `/api/recaptcha`: reCAPTCHA検証（レート制限あり）
- `/api/register`: ユーザー登録（レート制限あり）
- `/api/news`: ニュースCRUD
- `/api/works`: 実績CRUD

### Validation
- Zodスキーマに統一 (`src/lib/validation.ts`)
- InquirySchema, RegistrationSchema, LoginSchema
- XSSサニタイズ対応（xssパッケージ）

### Rate Limiting
- 統一されたレート制限 (`src/lib/rate-limit.ts`)
- プリセット: register, login, contact, recaptcha, api

### Session Types
- `src/app/types/next-auth.d.ts` でSession/User/JWT型を拡張
- UserRole型: "ADMIN" | "EDITOR" | "VIEWER"

### Security Headers
- `next.config.ts` でセキュリティヘッダーを設定（HSTS, X-Frame-Options等）

### Styling
- MUIコンポーネント + カスタムテーマ (`src/theme/`)
- Tailwind CSSとの併用
- Framer Motionによるアニメーション

## Workflow Best Practices

- `next/` ディレクトリがアプリケーション本体
- Docker環境推奨（MySQL依存のため）
- 認証が必要なページは `/login` 経由でアクセス
- 画像アップロードは `/public/uploads` に保存
- ブランチ: `main`(本番) → `develop`(開発) → `feature/*` or `fix/*`
