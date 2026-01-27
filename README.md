# 瀬田製作所 ホームページ

## 概要

瀬田製作所のホームページプロジェクト。[Next.js 15](https://nextjs.org/)をベースに構築し、App Routerを採用。React、MUIを中心としたフロントエンド技術を使用。

## 目次

- [クイックスタート](#クイックスタート)
- [Docker環境の構成](#docker環境の構成)
- [環境変数の設定](#環境変数の設定)
- [開発コマンド](#開発コマンド)
- [本番デプロイ](#本番デプロイ)
- [主要技術スタック](#主要技術スタック)
- [ディレクトリ構成](#ディレクトリ構成)
- [開発ルール](#開発ルール)
- [DB運用](#db運用)
- [SEO設定](#seo設定)
- [セキュリティ](#セキュリティ)
- [運用スクリプト](#運用スクリプト)
- [その他設定](#その他設定)

## クイックスタート

### 必要条件

- Docker
- Docker Compose

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
| next | next_app | 2999:3000 | Next.js（standalone / ghcr.ioからpull） |
| mysql | mysql_db | 3306 | MySQL 8.0 データベース |
| nginx | nginx_proxy | 80, 443 | リバースプロキシ（SSL対応） |
| certbot | certbot | - | SSL証明書管理 |

### アーキテクチャ（本番）

```
[ブラウザ] → [nginx:443] → [next:3000] → [mysql:3306]
              ↑ SSL/TLS
         [certbot] (証明書更新)
```

## 環境変数の設定

`next/.env`ファイルに以下を設定：

```env
# 認証
AUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# データベース
DATABASE_URL=mysql://app_user:app_pass@mysql:3306/app_db

# Google OAuth（オプション）
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
```

## 開発コマンド

```bash
# 開発環境の起動（yarn dev + ホットリロード）
docker compose -f docker-compose.dev.yml up

# 停止
docker compose -f docker-compose.dev.yml down

# ログ確認
docker compose -f docker-compose.dev.yml logs -f next

# コンテナ内でシェル実行
docker compose -f docker-compose.dev.yml exec next sh

# Lint実行
cd next && yarn lint
```

エイリアスを設定すると便利です（`~/.bashrc`に追加）：

```bash
alias dc-dev='docker compose -f docker-compose.dev.yml'
```

## 本番デプロイ

GitHub Actionsによる自動デプロイ：

1. `develop` → `main` へのPRをマージ
2. Lint実行
3. マルチステージビルドでDockerイメージをビルド & ghcr.ioにpush
4. 本番サーバーでイメージをpull & 起動
5. SSL証明書の自動取得/更新

### Dockerイメージ

マルチステージビルドにより軽量イメージ（~500MB）を生成。本番サーバーではpullのみ行い、ビルドは行わない。

### SSL証明書の自動管理

デプロイ時に以下の処理が自動実行されます：

- **初回デプロイ**: Let's Encrypt から SSL 証明書を自動取得
- **2回目以降**: 証明書の有効期限をチェックし、必要に応じて更新

nginx は証明書の有無を自動判定：
- 証明書なし → HTTP のみで起動
- 証明書あり → HTTPS 有効、HTTP→HTTPS リダイレクト

### 手動デプロイ

```bash
ssh your-server
cd ~/seta-hp
git pull origin main
docker compose pull
docker compose up -d
```

## 主要技術スタック

### フロントエンド
- TypeScript
- React 19
- Next.js 15 (App Router)
- MUI (Material UI)
- Tailwind CSS
- Framer Motion

### バックエンド
- Next.js API Routes
- Prisma ORM
- Auth.js (NextAuth)
- MySQL 8.0

### インフラ
- Docker / Docker Compose
- Nginx
- GitHub Actions (CI/CD)
- Google Cloud Platform (本番)

## ディレクトリ構成

```
seta-hp/
├── docker-compose.yml      # 本番用Docker Compose
├── docker-compose.dev.yml  # 開発用Docker Compose
├── nginx/
│   ├── default.conf.template  # Nginx設定テンプレート
│   └── docker-entrypoint.sh   # SSL自動判定スクリプト
├── mysql/
│   └── data/               # MySQLデータ（gitignore）
├── scripts/                # 運用スクリプト
│   ├── renew-ssl.sh        # SSL証明書更新
│   ├── backup-db.sh        # DBバックアップ
│   ├── monitor.sh          # サービス監視
│   └── setup-monitoring.sh # 監視セットアップ
├── fail2ban/               # fail2ban設定
│   ├── jail.local          # メイン設定
│   └── filter.d/           # フィルター定義
├── logwatch/               # logwatch設定
│   └── logwatch.conf       # レポート設定
├── certbot/                # SSL証明書（gitignore）
│   ├── conf/               # Let's Encrypt設定
│   └── www/                # チャレンジ用
└── next/
    ├── Dockerfile          # Next.jsコンテナ設定
    ├── .env                # 環境変数（gitignore）
    ├── .env.example        # 環境変数テンプレート
    ├── prisma/
    │   ├── schema.prisma   # DBスキーマ定義
    │   └── migrations/     # マイグレーション履歴
    └── src/
        ├── app/            # ページ・APIルート
        ├── components/     # 共通コンポーネント
        ├── lib/            # ユーティリティ（rateLimit含む）
        └── theme/          # MUIテーマ設定
```

## 開発ルール

### ブランチ運用

- `main` - 本番環境
- `develop` - 開発統合ブランチ
- `feature/*` - 新機能開発
- `fix/*` - バグ修正

### ブランチ命名規則

```
feature/0034_create-top-page
fix/0035_login-error
```

### プルリクエスト

1. `develop`から作業ブランチを作成
2. 実装・コミット
3. `develop`へPR作成
4. レビュー後マージ
5. `develop` → `main`へPRでリリース

## DB運用

### スキーマ変更時

```bash
# 1. schema.prismaを編集

# 2. マイグレーション作成
docker compose exec next npx prisma migrate dev --name your_migration_name

# 3. クライアント再生成（自動で実行されるが念のため）
docker compose exec next npx prisma generate
```

### トラブルシューティング

```bash
# Prismaキャッシュクリア
docker compose exec next sh -c "rm -rf node_modules/.prisma && npx prisma generate"

# DB接続確認
docker compose exec mysql mysql -u app_user -papp_pass app_db
```

## SEO設定

### メタデータ

`next/src/app/layout.tsx`でサイト全体のSEO設定を管理：

| 項目 | 説明 |
|-----|------|
| OGP | Open Graph Protocol（SNS共有用） |
| Twitter Card | Twitter向けカード表示 |
| robots | 検索エンジンクローラー設定 |
| canonical | 正規URL指定 |
| JSON-LD | 構造化データ（Organization） |

### OG画像

`next/public/og-image.png` - 1200x630px

SNSでシェアされた際に表示されるサムネイル画像。

### 各ページのメタデータ

主要ページに個別のメタデータを設定済み：

| ページ | ファイル |
|-------|---------|
| トップ | `src/app/page.tsx` |
| お問い合わせ | `src/app/contact/page.tsx` |
| 会社概要 | `src/app/discription/page.tsx` |
| サービス | `src/app/consultation/page.tsx` |
| お支払い | `src/app/payment/layout.tsx` |
| プライバシーポリシー | `src/app/privacy-policy/page.tsx` |

### Sitemap

`next-sitemap`で自動生成。設定ファイル: `next/next-sitemap.config.cjs`

**Google向け最適化済み:**
- `changefreq` / `priority` は Google が無視するため不使用
- `lastmod` のみを設定
- 管理画面・API・決済完了ページは除外

**除外されるパス:**
- `/portal-admin*`, `/portal-login*`
- `/payment/success`, `/payment/cancel`
- `/api/*`

Google Search Console に登録済み。

## セキュリティ

### 実装済みセキュリティ機能

| 機能 | 説明 |
|-----|------|
| NextAuth認証 | bcryptによるパスワードハッシュ |
| ユーザーロール | ADMIN / EDITOR / VIEWER |
| レート制限 | IP単位でのリクエスト制限 |
| API保護 | ADMIN権限チェック（upload/delete） |
| reCAPTCHA v3 | フォームスパム対策 |
| XSSサニタイズ | xssパッケージによる入力サニタイズ |

### Nginx セキュリティヘッダー

`nginx/docker-entrypoint.sh`でHTTPS有効時に以下を設定：

| ヘッダー | 値 | 効果 |
|---------|-----|------|
| `X-Frame-Options` | SAMEORIGIN | クリックジャッキング防止 |
| `X-Content-Type-Options` | nosniff | MIMEスニッフィング防止 |
| `X-XSS-Protection` | 1; mode=block | XSS攻撃防止 |
| `Referrer-Policy` | strict-origin-when-cross-origin | リファラー情報制限 |
| `Strict-Transport-Security` | max-age=31536000 | HTTPS強制（HSTS） |
| `Permissions-Policy` | camera=(), microphone=()... | ブラウザ機能制限 |

### fail2ban

SSH/Nginxへの不正アクセス対策：

```bash
# 設定ファイルをコピー
sudo cp fail2ban/jail.local /etc/fail2ban/
sudo cp fail2ban/filter.d/* /etc/fail2ban/filter.d/

# 再起動
sudo systemctl restart fail2ban
```

### logwatch

日次ログレポート：

```bash
# 設定ファイルをコピー
sudo cp logwatch/logwatch.conf /etc/logwatch/conf/

# テスト実行
sudo logwatch --output stdout
```

## 運用スクリプト

`scripts/`ディレクトリに運用スクリプトを配置：

| スクリプト | 説明 |
|-----------|------|
| `renew-ssl.sh` | SSL証明書の更新 |
| `backup-db.sh` | DBバックアップ（7日間保持） |
| `monitor.sh` | サービス死活監視 |
| `setup-monitoring.sh` | 監視環境セットアップ |

### SSL証明書更新

```bash
# 手動実行
./scripts/renew-ssl.sh

# cron設定（毎日3時に実行）
0 3 * * * /root/seta-hp/scripts/renew-ssl.sh >> /var/log/ssl-renew.log 2>&1
```

### DBバックアップ

```bash
# 手動実行
./scripts/backup-db.sh

# cron設定（毎日2時に実行）
0 2 * * * /root/seta-hp/scripts/backup-db.sh >> /var/log/backup.log 2>&1
```

### サービス監視

```bash
# 監視セットアップ
./scripts/setup-monitoring.sh

# 死活監視実行
./scripts/monitor.sh
```

## その他設定

### Azure MSAL（問い合わせメール）

MS 365との連携設定は別途ドキュメント参照。

### reCAPTCHA v3

問い合わせフォームのスパム対策として導入。

### ESLint

`next/core-web-vitals`と`next/typescript`を使用。設定ファイル: `next/.eslintrc.json`

```bash
# Lint実行
cd next && yarn lint
```

## ライセンス

このプロジェクトは瀬田製作所に帰属します。
