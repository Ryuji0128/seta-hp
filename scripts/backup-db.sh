#!/bin/bash
# DBバックアップスクリプト
# cron設定例: 0 4 * * * /root/seta-hp/scripts/backup-db.sh >> /var/log/db-backup.log 2>&1

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_DIR/backups"
RETENTION_DAYS=7

# 環境変数読み込み
if [ -f "$PROJECT_DIR/.env" ]; then
    export $(grep -v '^#' "$PROJECT_DIR/.env" | xargs)
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

if [ $? -eq 0 ]; then
    echo "バックアップ成功: $BACKUP_FILE"
    echo "ファイルサイズ: $(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)"
else
    echo "エラー: バックアップに失敗しました"
    exit 1
fi

# 古いバックアップの削除（RETENTION_DAYS日以上前）
echo "古いバックアップを削除中（${RETENTION_DAYS}日以上前）..."
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete

# 残りのバックアップ一覧
echo "現在のバックアップ一覧:"
ls -lh "$BACKUP_DIR"/*.sql.gz 2>/dev/null || echo "バックアップファイルなし"

echo "=========================================="
echo "DBバックアップ終了: $(date)"
echo "=========================================="
