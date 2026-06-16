#!/bin/bash
# DBバックアップスクリプト（EC + Designer の両DB）
#
# 対象:
#   - EC(HP)  : docker compose の mysql サービス（app_db）。creds は next/.env
#   - Designer: designer-mysql コンテナ（kazalove）。creds は ~/display_design/.env.prod
# 仕様: mysqldump → gzip 圧縮、保持 RETENTION_DAYS 日（最低 MIN_BACKUP_COUNT 件は残す）。
#
# cron 設定例（毎日 4:00）:
#   0 4 * * * cd /home/ubuntu/seta-hp && ./scripts/backup-db.sh >> /var/log/db-backup.log 2>&1

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="${BACKUP_DIR:-$PROJECT_DIR/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
MIN_BACKUP_COUNT="${MIN_BACKUP_COUNT:-3}"
DESIGNER_ENV_FILE="${DESIGNER_ENV_FILE:-$HOME/display_design/.env.prod}"
DESIGNER_MYSQL_CONTAINER="${DESIGNER_MYSQL_CONTAINER:-designer-prod-designer-mysql-1}"

mkdir -p "$BACKUP_DIR"
_ts() { date +%Y%m%d_%H%M%S; }
_fail=0

echo "=========================================="
echo "DBバックアップ開始: $(date)"
echo "=========================================="

# --- EC(HP) DB ---
(
  set -a
  [ -f "$PROJECT_DIR/next/.env" ] && . "$PROJECT_DIR/next/.env"
  set +a
  EC_USER="${MYSQL_USER:-app_user}"
  EC_PASS="${MYSQL_PASSWORD:-app_pass}"
  EC_DB="${MYSQL_DATABASE:-app_db}"
  OUT="$BACKUP_DIR/ec_${EC_DB}_$(_ts).sql.gz"
  echo "[EC] ${EC_DB} を dump 中..."
  if ( cd "$PROJECT_DIR" && docker compose -f docker-compose.yml exec -e MYSQL_PWD="$EC_PASS" -T mysql \
        mysqldump -u"$EC_USER" \
        --single-transaction --quick --lock-tables=false --no-tablespaces "$EC_DB" ) | gzip > "$OUT" && [ -s "$OUT" ]; then
    echo "[EC] OK: $(basename "$OUT") ($(du -h "$OUT" | cut -f1))"
  else
    echo "[EC] 失敗。空ファイルを削除。" >&2; rm -f "$OUT"; exit 1
  fi
) || _fail=1

# --- Designer DB ---
if [ -f "$DESIGNER_ENV_FILE" ] && docker ps --format '{{.Names}}' | grep -qx "$DESIGNER_MYSQL_CONTAINER"; then
  (
    DES_USER="$(grep -E '^MYSQL_USER=' "$DESIGNER_ENV_FILE" | cut -d= -f2-)"; DES_USER="${DES_USER:-kazalove}"
    DES_PASS="$(grep -E '^MYSQL_PASSWORD=' "$DESIGNER_ENV_FILE" | cut -d= -f2-)"
    DES_DB="$(grep -E '^MYSQL_DB=' "$DESIGNER_ENV_FILE" | cut -d= -f2-)"; DES_DB="${DES_DB:-kazalove}"
    OUT="$BACKUP_DIR/designer_${DES_DB}_$(_ts).sql.gz"
    echo "[Designer] ${DES_DB} を dump 中..."
    if docker exec -e MYSQL_PWD="$DES_PASS" -i "$DESIGNER_MYSQL_CONTAINER" \
        mysqldump -u"$DES_USER" \
        --single-transaction --quick --lock-tables=false --no-tablespaces "$DES_DB" | gzip > "$OUT" && [ -s "$OUT" ]; then
      echo "[Designer] OK: $(basename "$OUT") ($(du -h "$OUT" | cut -f1))"
    else
      echo "[Designer] 失敗。空ファイルを削除。" >&2; rm -f "$OUT"; exit 1
    fi
  ) || _fail=1
else
  echo "[Designer] env($DESIGNER_ENV_FILE) または コンテナ($DESIGNER_MYSQL_CONTAINER) が無いためスキップ"
fi

# --- 古いバックアップの削除（RETENTION_DAYS 日以上前。最低 MIN_BACKUP_COUNT 件は残す） ---
TOTAL="$(find "$BACKUP_DIR" -maxdepth 1 -name '*.sql.gz' | wc -l)"
if [ "$TOTAL" -gt "$MIN_BACKUP_COUNT" ]; then
  echo "古いバックアップを削除中（${RETENTION_DAYS}日以上前）..."
  find "$BACKUP_DIR" -maxdepth 1 -name '*.sql.gz' -mtime +"$RETENTION_DAYS" -delete
else
  echo "バックアップ数が${MIN_BACKUP_COUNT}件以下のため削除しません。"
fi

echo "現在のバックアップ一覧:"
ls -lh "$BACKUP_DIR"/*.sql.gz 2>/dev/null | tail -20 || echo "バックアップファイルなし"

echo "=========================================="
echo "DBバックアップ終了: $(date) (fail=${_fail})"
echo "=========================================="
exit "$_fail"
