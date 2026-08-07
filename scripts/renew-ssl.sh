#!/bin/bash
# SSL証明書更新スクリプト
# cron設定例: 0 3 1 * * /root/seta-hp/scripts/renew-ssl.sh >> /var/log/certbot-renew.log 2>&1

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo "=========================================="
echo "SSL証明書更新開始: $(date)"
echo "=========================================="

if docker compose run --rm certbot renew --webroot -w /var/www/certbot --quiet; then
    # certbot renew は更新不要の場合も成功するため、安全のため毎回設定を再読込する。
    echo "証明書の確認完了。Nginxをリロードします..."
    docker compose exec -T nginx nginx -s reload
    echo "Nginxリロード完了"
else
    echo "証明書更新処理に失敗しました" >&2
    exit 1
fi

echo "=========================================="
echo "SSL証明書更新終了: $(date)"
echo "=========================================="
