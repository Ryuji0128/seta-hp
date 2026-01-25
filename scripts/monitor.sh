#!/bin/bash
# サービス死活監視スクリプト
# cron設定例: */5 * * * * /root/seta-hp/scripts/monitor.sh >> /var/log/monitor.log 2>&1

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ALERT_EMAIL="${ALERT_EMAIL:-admin@example.com}"

cd "$PROJECT_DIR"

# 監視対象コンテナ
CONTAINERS=("next_app" "mysql_db" "nginx_proxy")

echo "=========================================="
echo "サービス監視: $(date)"
echo "=========================================="

FAILED_CONTAINERS=()

for container in "${CONTAINERS[@]}"; do
    status=$(docker inspect -f '{{.State.Status}}' "$container" 2>/dev/null || echo "not_found")

    if [ "$status" != "running" ]; then
        echo "警告: $container が停止中 (status: $status)"
        FAILED_CONTAINERS+=("$container")

        # 自動復旧を試行
        echo "$container の再起動を試行中..."
        docker compose up -d "$container" 2>/dev/null || true
    else
        echo "OK: $container は正常稼働中"
    fi
done

# 障害があった場合、メール通知
if [ ${#FAILED_CONTAINERS[@]} -gt 0 ]; then
    HOSTNAME=$(hostname)
    MESSAGE="以下のコンテナが停止していました。自動復旧を試行しました。

サーバー: $HOSTNAME
時刻: $(date)
停止コンテナ: ${FAILED_CONTAINERS[*]}

手動確認をお願いします。"

    echo "メール通知を送信中..."
    echo "$MESSAGE" | mail -s "[警告] サービス障害検知 - $HOSTNAME" "$ALERT_EMAIL" 2>/dev/null || \
        echo "メール送信に失敗しました（mailコマンド未設定の可能性）"
fi

echo "=========================================="
echo "監視完了: $(date)"
echo "=========================================="
