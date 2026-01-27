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

EXPOSE 3000
CMD ["node", "server.js"]
