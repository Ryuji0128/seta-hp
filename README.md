# SETA Craft

瀬田製作所が運営するハンドメイド製品の EC サイト「SETA Craft」のソースコードです。
Next.js 15 (App Router) + MUI + Prisma + MySQL で構成されたフルスタック Web アプリケーション。

## 目次

- [クイックスタート](#クイックスタート)
- [Docker環境の構成](#docker環境の構成)
- [環境変数の設定](#環境変数の設定)
- [開発コマンド](#開発コマンド)
- [主要技術スタック](#主要技術スタック)
- [ページ一覧](#ページ一覧)
- [API エンドポイント](#api-エンドポイント)
- [データベースモデル](#データベースモデル)
- [ディレクトリ構成](#ディレクトリ構成)
- [開発ルール](#開発ルール)
- [DB運用](#db運用)
- [SEO設定](#seo設定)
- [セキュリティ](#セキュリティ)
- [本番デプロイ](#本番デプロイ)
- [運用スクリプト](#運用スクリプト)

## クイックスタート

### 必要条件

- Docker & Docker Compose
- Node.js 20+（ローカル開発時）
- Yarn

### セットアップ

```bash
# 1. リポジトリをクローン
git clone https://github.com/Ryuji0128/seta-hp.git
cd seta-hp

# 2. 環境変数ファイルを配置
cp next/.env.example next/.env
# .envファイルを編集して必要な値を設定

# 3. Docker環境を起動（開発）
docker compose -f docker-compose.dev.yml up

# 4. ブラウザでアクセス
# http://localhost:3000
```

### ローカル開発（Docker なし）

```bash
cd next
yarn install
npx prisma generate
npx prisma db push
npx prisma db seed    # シードデータ投入（任意）
yarn dev              # http://localhost:3000
```

### 停止

```bash
docker compose -f docker-compose.dev.yml down
```

## Docker環境の構成

### 開発環境（docker-compose.dev.yml）

| サービス | コンテナ名 | ポート | 説明 |
|---------|-----------|--------|------|
| next | next_app | 3000:3000 | Next.js（yarn dev / ホットリロード） |
| mysql | mysql_db | 3306 | MySQL 8.0 データベース |

### 本番環境（docker-compose.yml）

| サービス | コンテナ名 | ポート | 説明 |
|---------|-----------|--------|------|
| next | next_app | 2999:3000 | Next.js（standalone / ghcr.io から pull） |
| mysql | mysql_db | 3306 | MySQL 8.0 データベース |
| nginx | nginx_proxy | 80, 443 | リバースプロキシ（SSL 対応） |
| certbot | certbot | - | SSL 証明書管理 |

### アーキテクチャ（本番）

```
[ブラウザ] → [nginx:443] → [next:3000] → [mysql:3306]
              ↑ SSL/TLS
         [certbot] (証明書更新)
```

## 環境変数の設定

`next/.env.example` をコピーして `next/.env` を作成し、各値を設定：

| 変数名 | 説明 |
|--------|------|
| `DATABASE_URL` | MySQL 接続文字列 |
| `AUTH_SECRET` | NextAuth 暗号化キー |
| `NEXTAUTH_URL` | 認証コールバック URL |
| `NEXT_PUBLIC_SITE_URL` | サイト URL（フロントエンド参照） |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth（任意） |
| `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED` | Google 認証の有効化フラグ（任意） |
| `STRIPE_SECRET_KEY` | Stripe 秘密鍵 |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA v3 サイトキー（フロントエンド用） |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA v3 検証用（サーバー用） |
| `ALLOWED_RECAPTCHA_HOSTNAMES` | reCAPTCHA 許可ホスト名（カンマ区切り） |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | メール送信設定 |
| `CONTACT_TO_EMAIL` | お問い合わせ受信メールアドレス |
| `ADMIN_EMAIL` / `ADMIN_NAME` / `ADMIN_PASSWORD` | 管理者シードデータ（`prisma db seed` 用） |

## 開発コマンド

```bash
# Docker 経由
docker compose -f docker-compose.dev.yml up        # 起動
docker compose -f docker-compose.dev.yml down       # 停止
docker compose -f docker-compose.dev.yml logs -f next  # ログ
docker compose -f docker-compose.dev.yml exec next sh  # シェル

# ローカル（next/ ディレクトリで実行）
cd next
yarn dev              # 開発サーバー (Turbopack)
yarn build            # プロダクションビルド + sitemap 生成
yarn lint             # ESLint
npx tsc --noEmit      # 型チェック

# Prisma
npx prisma generate   # Client 再生成
npx prisma db push    # スキーマを DB に反映
npx prisma studio     # DB GUI ツール
npx prisma db seed    # シードデータ投入
```

## 主要技術スタック

| レイヤー | 技術 |
|---------|------|
| Frontend | Next.js 15, React 19, MUI v6, Tailwind CSS, Framer Motion |
| Backend | Next.js API Routes, NextAuth.js v5 (JWT + Credentials / Google OAuth) |
| Database | MySQL 8.0, Prisma ORM |
| 決済 | Stripe |
| セキュリティ | reCAPTCHA v3, Zod バリデーション, XSS サニタイズ, レート制限 |
| インフラ | Docker, Nginx, GitHub Actions (CI/CD), Google App Engine |
| メール | Nodemailer (SMTP) |

## ページ一覧

### 公開ページ

| パス | 説明 |
|------|------|
| `/` | トップページ (Hero, カテゴリ, 特集商品, 工房紹介, CTA) |
| `/products` | 商品一覧 |
| `/products/[id]` | 商品詳細 |
| `/gallery` | ギャラリー |
| `/works` | 実績・ポートフォリオ |
| `/about` | SETA Craft について |
| `/company` | 会社情報（瀬田製作所） |
| `/contact` | お問い合わせフォーム |
| `/shipping` | 配送について |
| `/shop` | ショップ |
| `/consultation` | ご相談 |
| `/engineering` | エンジニアリング |
| `/fabrication` | ファブリケーション |
| `/discription` | 会社概要 |
| `/legal` | 特定商取引法に基づく表記 |
| `/privacy-policy` | プライバシーポリシー |
| `/payment` | Stripe 決済フロー |

### 認証ページ

| パス | 説明 |
|------|------|
| `/login` | ログイン（Credentials / Google OAuth） |
| `/register` | ユーザー登録 |

### 管理ページ（要ログイン）

| パス | 説明 |
|------|------|
| `/products-manage` | 商品管理 |
| `/gallery-manage` | ギャラリー管理 |
| `/works-manage` | 実績管理 |
| `/news` | ニュース管理 |
| `/estimates` | 見積管理 |

> **Note**: 管理ページはログイン済みであればアクセス可能です。書込み・削除などの操作は API 側で ADMIN / EDITOR ロールを要求します。

## API エンドポイント

| メソッド | パス | 説明 | 認証 |
|---------|------|------|------|
| POST | `/api/auth/[...nextauth]` | NextAuth 認証 | - |
| GET/POST/PUT/DELETE | `/api/products` | 商品 CRUD | 読取: 公開のみ無認証 / 非公開取得・書込: ADMIN/EDITOR |
| GET/POST/PUT/DELETE | `/api/works` | 実績 CRUD | 書込: ADMIN/EDITOR |
| GET/POST/PUT/DELETE | `/api/news` | ニュース CRUD | 書込: ADMIN/EDITOR |
| GET/POST/DELETE | `/api/email` | お問い合わせ（送信・一覧・削除） | POST: レート制限 / GET: 要認証 / DELETE: ADMIN |
| GET/POST/DELETE | `/api/estimates` | 見積管理 | 要認証 |
| POST | `/api/recaptcha` | reCAPTCHA 検証 | - (レート制限あり) |
| POST | `/api/register` | ユーザー登録 | - (レート制限あり) |
| POST | `/api/upload` | 画像アップロード | 要認証 |
| POST | `/api/admin/upload` | 管理者画像アップロード | 要認証 |
| POST | `/api/checkout/onetime` | Stripe 単発決済 | - |
| POST | `/api/checkout/subscription` | Stripe サブスクリプション決済 | - |

## データベースモデル

| モデル | 説明 |
|--------|------|
| **User** | ユーザー (ADMIN / EDITOR / VIEWER ロール, Credentials / Google OAuth) |
| **Product** | 商品（名前, 価格, カテゴリ, 複数画像, 在庫状況, 公開/非公開） |
| **Work** | 実績・ポートフォリオ |
| **News** | ニュース記事（JSON コンテンツ） |
| **Inquiry** | お問い合わせ |
| **Estimate** | 見積書（PDF, 金額, Stripe 決済状態） |
| **Account / Session** | NextAuth 認証関連 |

### 商品カテゴリ

- カードディスプレイ (`card-display`)
- アクリル製品 (`acrylic`)
- 3Dプリント製品 (`3d-print`)

### 在庫状況

- 在庫あり / 残りわずか / 受注生産 / 売り切れ

## ディレクトリ構成

```
seta-hp/
├── docker-compose.yml          # 本番用 Docker Compose
├── docker-compose.dev.yml      # 開発用 Docker Compose
├── nginx/                      # Nginx 設定
│   ├── default.conf.template
│   └── docker-entrypoint.sh
├── scripts/                    # 運用スクリプト
│   ├── renew-ssl.sh
│   ├── backup-db.sh
│   ├── monitor.sh
│   └── setup-monitoring.sh
├── fail2ban/                   # fail2ban 設定
├── logwatch/                   # logwatch 設定
├── certbot/                    # SSL 証明書（gitignore）
├── CLAUDE.md                   # Claude Code 設定
└── next/                       # Next.js アプリケーション
    ├── Dockerfile
    ├── package.json
    ├── next.config.ts
    ├── auth.config.ts           # NextAuth 設定
    ├── prisma/
    │   ├── schema.prisma        # DB スキーマ定義
    │   └── seed.ts              # シードデータ
    ├── public/                  # 静的ファイル & アップロード画像
    └── src/
        ├── app/                 # App Router (ページ & API)
        │   ├── _home/           # トップページセクション
        │   ├── about/           # SETA Craft について
        │   ├── api/             # API Routes
        │   │   ├── admin/upload/ # 管理者画像アップロード
        │   │   ├── auth/        # NextAuth
        │   │   ├── checkout/    # Stripe 決済 (onetime, subscription)
        │   │   ├── email/       # お問い合わせ (送信・一覧・削除)
        │   │   ├── estimates/   # 見積管理
        │   │   ├── news/        # ニュース CRUD
        │   │   ├── products/    # 商品 CRUD
        │   │   ├── recaptcha/   # reCAPTCHA 検証
        │   │   ├── register/    # ユーザー登録
        │   │   ├── upload/      # 画像アップロード
        │   │   └── works/       # 実績 CRUD
        │   ├── company/         # 会社情報
        │   ├── consultation/    # ご相談
        │   ├── contact/         # お問い合わせ
        │   ├── discription/     # 会社概要
        │   ├── engineering/     # エンジニアリング
        │   ├── fabrication/     # ファブリケーション
        │   ├── gallery/         # ギャラリー
        │   ├── gallery-manage/  # ギャラリー管理
        │   ├── legal/           # 特定商取引法
        │   ├── login/           # ログイン
        │   ├── products/        # 商品一覧 & 詳細
        │   ├── products-manage/ # 商品管理
        │   ├── register/        # ユーザー登録
        │   ├── shipping/        # 配送について
        │   ├── shop/            # ショップ
        │   ├── works/           # 実績
        │   └── works-manage/    # 実績管理
        ├── components/          # 共有コンポーネント
        ├── lib/                 # ユーティリティ
        │   ├── constants/       # カテゴリ・在庫定義
        │   ├── api-response.ts  # API レスポンスヘルパー
        │   ├── rate-limit.ts    # インメモリレート制限
        │   ├── validation.ts    # Zod バリデーションスキーマ
        │   ├── auth.ts          # NextAuth 初期化
        │   └── db.ts            # Prisma クライアント
        ├── actions/             # Server Actions
        └── theme/               # MUI テーマ設定
```

## 開発ルール

### ブランチ運用

- `main` - 本番環境
- `develop` - 開発統合ブランチ
- `feature/*` - 新機能開発
- `fix/*` - バグ修正

### プルリクエスト

1. `develop` から作業ブランチを作成
2. 実装・コミット
3. `develop` へ PR 作成
4. レビュー後マージ
5. `develop` → `main` へ PR でリリース

## DB運用

### スキーマ変更時

```bash
# 1. schema.prisma を編集

# 2. マイグレーション作成
docker compose exec next npx prisma migrate dev --name your_migration_name

# 3. クライアント再生成（自動で実行されるが念のため）
docker compose exec next npx prisma generate
```

### トラブルシューティング

```bash
# Prisma キャッシュクリア
docker compose exec next sh -c "rm -rf node_modules/.prisma && npx prisma generate"

# DB 接続確認
docker compose exec mysql mysql -u app_user -papp_pass app_db
```

## SEO設定

### メタデータ

`next/src/app/layout.tsx` でサイト全体の SEO 設定を管理。

| 項目 | 説明 |
|-----|------|
| OGP | Open Graph Protocol（SNS 共有用） |
| Twitter Card | Twitter 向けカード表示 |
| robots | 検索エンジンクローラー設定 |
| canonical | 正規 URL 指定 |
| JSON-LD | 構造化データ（Organization） |

### Sitemap

`next-sitemap` で自動生成。設定ファイル: `next/next-sitemap.config.cjs`

- `changefreq` / `priority` は Google が無視するため不使用
- `lastmod` のみを設定
- 管理画面・API・決済完了ページは除外

## セキュリティ

### アプリケーション層

| 機能 | 説明 |
|-----|------|
| NextAuth 認証 | bcrypt によるパスワードハッシュ, JWT セッション |
| ロールベース認可 | ADMIN / EDITOR / VIEWER の 3 段階 |
| レート制限 | IP 単位のリクエスト制限（登録, ログイン, お問い合わせ, reCAPTCHA） |
| バリデーション | Zod スキーマによるサーバーサイド検証 |
| reCAPTCHA v3 | フォームスパム対策 |
| XSS サニタイズ | `xss` パッケージによる入力サニタイズ |

### セキュリティヘッダー（Next.js + Nginx）

| ヘッダー | 効果 |
|---------|------|
| `Strict-Transport-Security` | HTTPS 強制（HSTS） |
| `X-Frame-Options` | クリックジャッキング防止 |
| `X-Content-Type-Options` | MIME スニッフィング防止 |
| `X-XSS-Protection` | XSS 攻撃防止 |
| `Referrer-Policy` | リファラー情報制限 |
| `Permissions-Policy` | ブラウザ機能制限（カメラ, マイク, 位置情報） |

### サーバーセキュリティ

- **fail2ban**: SSH / Nginx への不正アクセス対策
- **logwatch**: 日次ログレポート

## 本番デプロイ

GitHub Actions による自動デプロイ：

1. `develop` → `main` への PR をマージ
2. Lint 実行
3. マルチステージビルドで Docker イメージをビルド & ghcr.io に push
4. 本番サーバーでイメージを pull & 起動
5. SSL 証明書の自動取得/更新

### 手動デプロイ

```bash
ssh your-server
cd ~/seta-hp
git pull origin main
docker compose pull
docker compose up -d
```

## 運用スクリプト

| スクリプト | 説明 |
|-----------|------|
| `scripts/renew-ssl.sh` | SSL 証明書の更新 |
| `scripts/backup-db.sh` | DB バックアップ（7日間保持） |
| `scripts/monitor.sh` | サービス死活監視 |
| `scripts/setup-monitoring.sh` | 監視環境セットアップ |

```bash
# cron 設定例
0 2 * * * /root/seta-hp/scripts/backup-db.sh >> /var/log/backup.log 2>&1
0 3 * * * /root/seta-hp/scripts/renew-ssl.sh >> /var/log/ssl-renew.log 2>&1
```

## 会社情報

- **会社名**: 瀬田製作所
- **ブランド名**: SETA Craft
- **設立**: 2023年8月8日
- **所在地**: 富山県高岡市
- **Email**: info@setaseisakusyo.com

## ライセンス

このプロジェクトは瀬田製作所に帰属します。
