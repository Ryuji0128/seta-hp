# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

SETA株式会社のコーポレートサイト。Next.js 15 (App Router) + MUI + Prisma + MySQL で構成されたフルスタックWebアプリケーション。

## Tech Stack

- **Frontend**: Next.js 15.1.7, React 19, MUI v6, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, NextAuth.js v5 (beta)
- **Database**: MySQL 8.0, Prisma ORM
- **Deployment**: Google App Engine, Cloud Build
- **Other**: Stripe決済, reCAPTCHA, Nodemailer

## Project Structure

```
seta-hp/
├── next/                    # Next.jsアプリケーション
│   ├── src/
│   │   ├── app/             # App Router pages & API routes
│   │   ├── components/      # 共有コンポーネント
│   │   ├── lib/             # ユーティリティ (db, validation, etc.)
│   │   ├── actions/         # Server Actions
│   │   └── theme/           # MUIテーマ設定
│   ├── prisma/              # Prismaスキーマ & マイグレーション
│   └── public/              # 静的ファイル
├── docker-compose.dev.yml   # 開発環境
└── claude-code-best-practice/  # Claude Code設定リファレンス
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

# Prisma
npx prisma generate   # Clientの生成
npx prisma db push    # スキーマをDBに反映
npx prisma studio     # DB GUIツール
npx prisma db seed    # シードデータ投入
```

## Key Pages

| Path | Description |
|------|-------------|
| `/` | ホームページ (Hero, Services, About, TechStack, News, CTA) |
| `/contact` | お問い合わせフォーム |
| `/news` | ニュース管理 (認証必要) |
| `/portal-login` | 管理者ログイン |
| `/payment` | Stripe決済フロー |
| `/estimates` | 見積管理 (認証必要) |
| `/privacy-policy` | プライバシーポリシー |

## Database Models

- **User**: 管理者ユーザー (ADMIN/EDITOR/VIEWER roles)
- **News**: ニュース記事 (日付, タイトル, JSON contents)
- **Inquiry**: お問い合わせ
- **Estimate**: 見積書 (PDF, 金額, Stripe決済状態)
- **Account/Session**: NextAuth認証関連

## Environment Variables

開発環境は `next/.env` に設定。主要な変数:
- `DATABASE_URL`: MySQL接続文字列
- `NEXTAUTH_SECRET`: NextAuth暗号化キー
- `NEXTAUTH_URL`: 認証コールバックURL
- `STRIPE_SECRET_KEY`: Stripe秘密鍵
- `RECAPTCHA_SECRET_KEY`: reCAPTCHA検証用

## Critical Patterns

### API Routes
- `/api/auth/[...nextauth]`: NextAuth認証エンドポイント
- `/api/email`: お問い合わせメール送信
- `/api/recaptcha`: reCAPTCHA検証
- `/api/news`: ニュースCRUD

### Validation
- Zodによるフォームバリデーション (`src/lib/validation.ts`)
- XSSサニタイズ対応

### Styling
- MUIコンポーネント + カスタムテーマ (`src/theme/`)
- Tailwind CSSとの併用
- Framer Motionによるアニメーション

## Workflow Best Practices

- `next/` ディレクトリがアプリケーション本体
- Docker環境推奨（MySQL依存のため）
- 認証が必要なページは `/portal-login` 経由でアクセス
- 画像アップロードは `/public/uploads` に保存
