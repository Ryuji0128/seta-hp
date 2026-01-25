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

# certbotで証明書更新を試行
docker compose run --rm certbot renew --webroot -w /var/www/certbot --quiet

# 更新があった場合、Nginxをリロード
if [ $? -eq 0 ]; then
    echo "証明書更新完了。Nginxをリロードします..."
    docker compose exec -T nginx nginx -s reload
    echo "Nginxリロード完了"
else
    echo "証明書の更新はありませんでした"
fi

echo "=========================================="
echo "SSL証明書更新終了: $(date)"
echo "=========================================="
