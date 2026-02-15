# Next.js プロジェクト構成指示書

このドキュメントは、mizuki-hpプロジェクトの構成を新しいプロジェクトで再現するための指示書です。

---

## 1. 技術スタック

以下の技術スタックでプロジェクトを構成してください：

| カテゴリ | 技術 | バージョン |
|---------|------|-----------|
| フレームワーク | Next.js (App Router) | 15.x |
| 言語 | TypeScript | 5.x |
| React | React | 19.x |
| UIライブラリ | Material UI (MUI) | 6.x |
| CSS | Tailwind CSS | 3.x |
| 認証 | NextAuth (Auth.js) | v5 beta |
| ORM | Prisma | 6.x |
| DB | MySQL | 8.0 |
| フォーム | React Hook Form + Zod | 最新 |
| アニメーション | Framer Motion | 12.x |
| デプロイ | Docker + nginx | - |

---

## 2. ディレクトリ構成

```
project-root/
├── next/                          # Next.jsアプリケーション
│   ├── src/
│   │   ├── app/                   # App Router (ページ・API)
│   │   │   ├── layout.tsx         # ルートレイアウト
│   │   │   ├── page.tsx           # トップページ
│   │   │   ├── globals.css        # グローバルCSS
│   │   │   ├── not-found.tsx      # 404ページ
│   │   │   ├── api/               # APIルート
│   │   │   │   └── [endpoint]/route.ts
│   │   │   ├── [page-name]/       # 各ページ
│   │   │   │   └── page.tsx
│   │   │   └── types/             # 型定義
│   │   ├── components/            # 共通コンポーネント
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── [Component].tsx
│   │   ├── lib/                   # ユーティリティ
│   │   │   ├── db.ts              # Prismaクライアント
│   │   │   ├── auth.ts            # 認証ヘルパー
│   │   │   ├── validation.ts      # Zodスキーマ
│   │   │   └── [utility].ts
│   │   ├── actions/               # Server Actions
│   │   │   └── [action].ts
│   │   ├── theme/                 # MUIテーマ
│   │   │   ├── theme.ts
│   │   │   └── themeConstants.ts
│   │   └── auth.ts                # NextAuth設定
│   ├── prisma/
│   │   ├── schema.prisma          # DBスキーマ
│   │   ├── migrations/            # マイグレーション
│   │   └── seed.ts                # シードデータ
│   ├── public/                    # 静的ファイル
│   ├── package.json
│   └── .env                       # 環境変数
├── nginx/                         # nginx設定
│   ├── default.conf.template
│   └── docker-entrypoint.sh
├── mysql/                         # MySQLデータ
│   └── data/
├── certbot/                       # SSL証明書
│   ├── conf/
│   └── www/
├── uploads/                       # アップロードファイル
├── docker-compose.yml
├── docker-compose.override.yml    # 開発用オーバーライド
└── .env                           # Docker用環境変数
```

---

## 3. 必須パッケージ (package.json)

```json
{
  "name": "project-name",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build && next-sitemap --config next-sitemap.config.cjs",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@auth/prisma-adapter": "^2.7.4",
    "@emotion/cache": "^11.14.0",
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@hookform/resolvers": "^4.1.0",
    "@mui/icons-material": "^6.4.4",
    "@mui/material": "^6.5.0",
    "@mui/material-nextjs": "^6.4.3",
    "@prisma/client": "^6.3.1",
    "axios": "^1.7.9",
    "bcryptjs": "^3.0.2",
    "dayjs": "^1.11.13",
    "framer-motion": "^12.4.3",
    "mysql2": "^3.12.0",
    "next": "15.1.11",
    "next-auth": "^5.0.0-beta.25",
    "next-sitemap": "^4.2.3",
    "nodemailer": "^6.10.1",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-hook-form": "^7.54.2",
    "xss": "^1.0.15",
    "zod": "^3.24.2"
  },
  "prisma": {
    "seed": "npx tsx prisma/seed.ts"
  },
  "devDependencies": {
    "@types/node": "^22.13.4",
    "@types/react": "^19.0.9",
    "@types/react-dom": "^19.0.3",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.20.1",
    "eslint-config-next": "15.0.3",
    "postcss": "^8.5.6",
    "prisma": "^6.3.1",
    "tailwindcss": "^3.4.3",
    "tsx": "^4.19.0",
    "typescript": "^5.7.3"
  }
}
```

---

## 4. ルートレイアウト構成 (layout.tsx)

```tsx
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import theme from "@/theme/theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "サイトタイトル",
  description: "サイトの説明",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header />
            {children}
            <Footer />
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
```

---

## 5. Prismaスキーマ (schema.prisma)

```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// ユーザー権限
enum UserRole {
  ADMIN
  EDITOR
  VIEWER
}

// ユーザー (NextAuth対応)
model User {
  id            String    @id @default(cuid())
  name          String?
  username      String?   @unique
  password      String?
  email         String?   @unique
  emailVerified DateTime?
  role          UserRole  @default(VIEWER)
  image         String?
  accounts      Account[]
  sessions      Session[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

// OAuth アカウント
model Account {
  id                       String  @id @default(cuid())
  userId                   String
  type                     String
  provider                 String
  providerAccountId        String
  refresh_token            String? @db.Text
  access_token             String? @db.Text
  expires_at               Int?
  token_type               String?
  scope                    String?
  id_token                 String? @db.Text
  session_state            String?
  refresh_token_expires_in Int?
  user                     User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt                DateTime @default(now())
  updatedAt                DateTime @updatedAt

  @@unique([provider, providerAccountId])
  @@index([userId])
}

// セッション
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([userId])
}

// メール検証トークン
model VerificationToken {
  identifier String
  token      String
  expires    DateTime

  @@unique([identifier, token])
}

// 以下、プロジェクト固有のモデルを追加
// model News { ... }
// model Blog { ... }
// model Inquiry { ... }
```

---

## 6. Docker構成 (docker-compose.yml)

```yaml
services:
  next:
    image: ghcr.io/[owner]/[repo]:${IMAGE_TAG:-latest}
    container_name: next_app
    ports:
      - "2999:3000"
    env_file:
      - ./next/.env
    environment:
      - DATABASE_URL=mysql://app_user:${MYSQL_PASSWORD:-app_pass}@mysql:3306/app_db
      - NEXTAUTH_URL=${NEXTAUTH_URL:-https://example.com}
      - NEXTAUTH_TRUST_HOST=true
      - NODE_ENV=production
      - NODE_OPTIONS=--max-old-space-size=256
      - NEXT_TELEMETRY_DISABLED=1
    volumes:
      - ./uploads:/app/public/uploads
    command: node server.js
    depends_on:
      mysql:
        condition: service_healthy
    mem_limit: 384m
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    container_name: mysql_db
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-root}
      MYSQL_DATABASE: ${MYSQL_DATABASE:-app_db}
      MYSQL_USER: ${MYSQL_USER:-app_user}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD:-app_pass}
    command: >
      --innodb-buffer-pool-size=96M
      --key-buffer-size=8M
      --max-connections=20
      --table-open-cache=128
      --tmp-table-size=8M
      --max-heap-table-size=8M
      --performance_schema=OFF
    mem_limit: 320m
    volumes:
      - ./mysql/data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-p${MYSQL_ROOT_PASSWORD:-root}"]
      interval: 5s
      timeout: 5s
      retries: 10
      start_period: 30s

  nginx:
    image: nginx:latest
    container_name: nginx_proxy
    ports:
      - "80:80"
      - "443:443"
    environment:
      - SERVER_NAME=${SERVER_NAME:-localhost}
    volumes:
      - ./nginx/default.conf.template:/etc/nginx/conf.d/default.conf.template:ro
      - ./nginx/docker-entrypoint.sh:/docker-entrypoint.sh:ro
      - ./certbot/conf:/etc/letsencrypt:ro
      - ./certbot/www:/var/www/certbot:ro
      - ./uploads:/var/www/uploads:ro
    entrypoint: ["/bin/sh", "/docker-entrypoint.sh"]
    depends_on:
      - next
    mem_limit: 96m
    restart: unless-stopped

  certbot:
    image: certbot/certbot
    container_name: certbot
    profiles: ["ssl"]
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    command: certonly --webroot --webroot-path=/var/www/certbot --email your@email.com --agree-tos --no-eff-email -d example.com -d www.example.com --keep-until-expiring
```

---

## 7. 環境変数 (.env)

### next/.env
```env
DATABASE_URL="mysql://user:password@localhost:3306/dbname"
AUTH_SECRET="your-auth-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# reCAPTCHA (任意)
RECAPTCHA_SECRET_KEY="your-recaptcha-secret"
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="your-recaptcha-site-key"

# メール送信 (任意)
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="your@email.com"
SMTP_PASS="your-password"
```

### ルート/.env
```env
MYSQL_ROOT_PASSWORD=secure_root_password
MYSQL_DATABASE=app_db
MYSQL_USER=app_user
MYSQL_PASSWORD=secure_password
SERVER_NAME=example.com
NEXTAUTH_URL=https://example.com
IMAGE_TAG=latest
```

---

## 8. MUIテーマ設定

### theme/theme.ts
```tsx
"use client";

import { createTheme } from "@mui/material/styles";
import { themeConstants } from "@/theme/themeConstants";

const theme = createTheme(themeConstants);

export default theme;
```

### theme/themeConstants.ts
```tsx
import { ThemeOptions } from "@mui/material/styles";

export const themeConstants: ThemeOptions = {
  palette: {
    primary: {
      main: "#1976d2",      // メインカラー
    },
    secondary: {
      main: "#dc004e",      // セカンダリカラー
    },
    background: {
      default: "#ffffff",
      paper: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Noto Sans JP", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",  // ボタンテキストを大文字にしない
        },
      },
    },
  },
};
```

---

## 9. Prismaクライアント (lib/db.ts)

```tsx
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

---

## 10. 推奨コンポーネント

以下の共通コンポーネントを作成することを推奨：

| コンポーネント | 用途 |
|--------------|------|
| Header.tsx | ヘッダー・ナビゲーション |
| Footer.tsx | フッター |
| BaseContainer.tsx | ページ共通のコンテナ |
| PageMainTitle.tsx | ページタイトル |

---

## 11. 開発コマンド

```bash
# 初期セットアップ
cd next
npm install
npx prisma generate
npx prisma migrate dev

# 開発サーバー
npm run dev

# ビルド
npm run build

# Prisma Studio (DBビューア)
npx prisma studio

# Docker起動 (本番)
docker-compose up -d

# SSL証明書取得
docker-compose --profile ssl up certbot
```

---

## 12. 注意事項

1. **App Router使用**: Pages Routerではなく、App Routerを使用
2. **Server Components優先**: クライアントコンポーネントは最小限に
3. **Server Actions活用**: フォーム送信などはServer Actionsで処理
4. **型安全**: TypeScript + Zodで型安全を確保
5. **XSS対策**: `xss`ライブラリでサニタイズ
6. **認証**: NextAuth v5 + Prisma Adapterを使用
7. **日本語対応**: `lang="ja"`、日本語フォント設定

---

---

## 13. Dockerfile (next/Dockerfile)

マルチステージビルドで軽量な本番イメージを作成：

```dockerfile
# ===== ビルドステージ =====
FROM node:20-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app
ENV NODE_OPTIONS="--max-old-space-size=2048"

# 依存関係を先にコピー（キャッシュが効く）
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 600000

# Prisma スキーマをコピーして generate
COPY prisma ./prisma
RUN npx prisma generate

# ソースコードをコピーしてビルド
COPY . .
RUN yarn build

# ===== 本番ステージ（軽量）=====
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app
ENV NODE_ENV=production

# standalone出力をコピー
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma

EXPOSE 3000
CMD ["node", "server.js"]
```

**重要**: `next.config.ts` に `output: "standalone"` を設定すること：

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
```

---

## 14. GitHub Actions CI/CD (.github/workflows/deploy_production.yml)

PRがmainにマージされたら自動デプロイ：

```yaml
name: Deploy_Production

on:
  pull_request:
    branches:
      - main
    types: [closed]
  workflow_dispatch:

concurrency:
  group: deploy-production
  cancel-in-progress: true

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: [owner]/[repo]  # 変更必須

jobs:
  build-and-push:
    if: github.event_name == 'workflow_dispatch' || (github.event.pull_request.merged == true && github.event.pull_request.base.ref == 'main')
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'yarn'
          cache-dependency-path: next/yarn.lock

      - name: Install dependencies
        working-directory: ./next
        run: yarn install --frozen-lockfile

      - name: Run lint
        working-directory: ./next
        run: yarn lint

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build and push Docker image
        uses: docker/build-push-action@v6
        with:
          context: ./next
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: read

    steps:
      - name: Deploy to Production Server
        uses: appleboy/ssh-action@v1
        env:
          GH_PAT: ${{ secrets.GH_PAT }}
          GH_USERNAME: ${{ secrets.GH_USERNAME }}
          IMAGE_TAG: ${{ github.sha }}
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USERNAME }}
          key: ${{ secrets.SSH_SECRET_KEY }}
          port: ${{ secrets.SSH_PORT }}
          command_timeout: 10m
          envs: GH_PAT,GH_USERNAME,IMAGE_TAG
          script: |
            set -e

            echo "Deploying..."

            cd ~/[project-directory]  # 変更必須

            echo "Pulling latest code..."
            git fetch origin main
            git checkout main
            git reset --hard origin/main

            echo "Logging in to GitHub Container Registry..."
            echo "${GH_PAT}" | docker login ghcr.io -u "${GH_USERNAME}" --password-stdin

            echo "Pulling image for tag: ${IMAGE_TAG}"
            export IMAGE_TAG="${IMAGE_TAG}"
            docker compose -f docker-compose.yml pull next

            echo "Starting mysql first..."
            docker compose -f docker-compose.yml up -d mysql

            echo "Waiting for MySQL to be ready..."
            i=1
            MYSQL_READY=false
            while [ $i -le 30 ]; do
              if docker compose -f docker-compose.yml exec -T mysql sh -c 'mysqladmin ping -h localhost -u root -p${MYSQL_ROOT_PASSWORD} --silent' 2>/dev/null; then
                echo "MySQL is ready!"
                MYSQL_READY=true
                break
              fi
              echo "Waiting for MySQL... ($i/30)"
              sleep 2
              i=$((i+1))
            done

            if [ "$MYSQL_READY" = "false" ]; then
              echo "ERROR: MySQL failed to become ready"
              exit 1
            fi

            echo "Running database migrations..."
            docker compose -f docker-compose.yml run --rm next node node_modules/prisma/build/index.js migrate deploy

            echo "Starting app containers..."
            docker compose -f docker-compose.yml up -d next nginx

            echo "Cleaning up old images..."
            docker image prune -f

            echo "Deployment completed!"
```

### 必要なGitHub Secrets

| Secret名 | 説明 |
|---------|------|
| `SSH_HOST` | サーバーのホスト名/IP |
| `SSH_USERNAME` | SSHユーザー名 |
| `SSH_SECRET_KEY` | SSH秘密鍵 |
| `SSH_PORT` | SSHポート (22等) |
| `GH_PAT` | GitHub Personal Access Token |
| `GH_USERNAME` | GitHubユーザー名 |

---

## 15. nginx設定

### nginx/default.conf.template

```nginx
# www → non-www リダイレクト (HTTP)
server {
    listen 80;
    server_name www.${SERVER_NAME};

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://${SERVER_NAME}$request_uri;
    }
}

# HTTP
server {
    listen 80;
    server_name ${SERVER_NAME};

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}
```

### nginx/docker-entrypoint.sh

```bash
#!/bin/sh
set -e

CERT_PATH="/etc/letsencrypt/live/[domain]/fullchain.pem"  # 変更必須

# 環境変数を展開
envsubst '${SERVER_NAME}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# SSL証明書が存在する場合、HTTPS設定を追加
if [ -f "$CERT_PATH" ]; then
    echo "SSL certificate found. Enabling HTTPS..."
    cat >> /etc/nginx/conf.d/default.conf << 'EOF'

# HTTPS
server {
    listen 443 ssl;
    server_name ${SERVER_NAME};

    ssl_certificate /etc/letsencrypt/live/[domain]/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/[domain]/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # セキュリティヘッダー
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    client_max_body_size 10M;

    location /uploads/ {
        alias /var/www/uploads/;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }

    location / {
        proxy_pass http://next_app:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /_next/static/ {
        proxy_pass http://next_app:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}

# www → non-www リダイレクト (HTTPS)
server {
    listen 443 ssl;
    server_name www.${SERVER_NAME};

    ssl_certificate /etc/letsencrypt/live/[domain]/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/[domain]/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;

    return 301 https://${SERVER_NAME}$request_uri;
}
EOF
    sed -i "s/\${SERVER_NAME}/${SERVER_NAME}/g" /etc/nginx/conf.d/default.conf
else
    echo "SSL certificate not found. Running HTTP only..."
    # HTTP専用の設定に変更（省略）
fi

exec nginx -g 'daemon off;'
```

---

## 16. プロジェクト初期化手順

### 1. リポジトリ作成

```bash
mkdir project-name && cd project-name
git init
```

### 2. Next.jsプロジェクト作成

```bash
npx create-next-app@latest next --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd next
```

### 3. 依存関係インストール

```bash
yarn add @auth/prisma-adapter @emotion/cache @emotion/react @emotion/styled \
  @hookform/resolvers @mui/icons-material @mui/material @mui/material-nextjs \
  @prisma/client axios bcryptjs dayjs framer-motion mysql2 next-auth next-sitemap \
  nodemailer react-hook-form xss zod

yarn add -D @types/bcryptjs @types/nodemailer prisma tsx
```

### 4. Prisma初期化

```bash
npx prisma init
# schema.prismaを編集
npx prisma migrate dev --name init
```

### 5. ディレクトリ作成

```bash
mkdir -p src/actions src/lib src/theme src/components
mkdir -p ../nginx ../mysql/data ../certbot/conf ../certbot/www ../uploads
```

### 6. 設定ファイル作成

- docker-compose.yml
- nginx/default.conf.template
- nginx/docker-entrypoint.sh
- .github/workflows/deploy_production.yml
- Dockerfile

### 7. GitHub設定

- リポジトリのSecretsを設定
- GitHub Packages (ghcr.io) への書き込み権限を有効化

---

この指示書に従ってプロジェクトを構成してください。
