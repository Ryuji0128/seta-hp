#!/bin/bash
# DBバックアップスクリプト
# cron設定例: 0 4 * * * /root/seta-hp/scripts/backup-db.sh >> /var/log/db-backup.log 2>&1

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_DIR/backups"
RETENTION_DAYS=7
MIN_BACKUP_COUNT=3

# 環境変数読み込み（docker-compose.ymlと同じnext/.envを使用）
if [ -f "$PROJECT_DIR/next/.env" ]; then
    set -a
    . "$PROJECT_DIR/next/.env"
    set +a
elif [ -f "$PROJECT_DIR/.env" ]; then
    set -a
    . "$PROJECT_DIR/.env"
    set +a
fi

# デフォルト値
MYSQL_USER=${MYSQL_USER:-app_user}
MYSQL_PASSWORD=${MYSQL_PASSWORD:-app_pass}
MYSQL_DATABASE=${MYSQL_DATABASE:-app_db}

echo "=========================================="
echo "DBバックアップ開始: $(date)"
echo "=========================================="

# バックアップディレクトリ作成
mkdir -p "$BACKUP_DIR"

# バックアップファイル名（タイムスタンプ付き）
BACKUP_FILE="${MYSQL_DATABASE}_$(date +%Y%m%d_%H%M%S).sql.gz"

# mysqldumpでバックアップ取得 & gzip圧縮
docker compose exec -T mysql mysqldump \
    -u"$MYSQL_USER" \
    -p"$MYSQL_PASSWORD" \
    --single-transaction \
    --quick \
    --lock-tables=false \
    "$MYSQL_DATABASE" | gzip > "$BACKUP_DIR/$BACKUP_FILE"

# バックアップ成功確認（ファイルサイズが0でないことを検証）
if [ ! -s "$BACKUP_DIR/$BACKUP_FILE" ]; then
    echo "エラー: バックアップファイルが空です。削除します。"
    rm -f "$BACKUP_DIR/$BACKUP_FILE"
    exit 1
fi

echo "バックアップ成功: $BACKUP_FILE"
echo "ファイルサイズ: $(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)"

# 古いバックアップの削除（最低MIN_BACKUP_COUNT件は保持）
BACKUP_COUNT=$(find "$BACKUP_DIR" -name "*.sql.gz" | wc -l)
if [ "$BACKUP_COUNT" -gt "$MIN_BACKUP_COUNT" ]; then
    echo "古いバックアップを削除中（${RETENTION_DAYS}日以上前）..."
    find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
else
    echo "バックアップ数が${MIN_BACKUP_COUNT}件以下のため、古いバックアップは削除しません。"
fi

# 残りのバックアップ一覧
echo "現在のバックアップ一覧:"
ls -lh "$BACKUP_DIR"/*.sql.gz 2>/dev/null || echo "バックアップファイルなし"

echo "=========================================="
echo "DBバックアップ終了: $(date)"
echo "=========================================="
