#!/bin/bash
# 自己ホスト型 監視＆アラート
# - コンテナ稼働/health、サイト到達(end-to-end)、ディスク、メモリをチェック
# - 異常時に管理者へメール通知（HPの SMTP=next/.env を利用、python3 smtplib）
# - 同一問題の連続通知はクールダウンで抑止
# - コンテナの自動復旧は各 compose の restart:unless-stopped に委ねる
#
# cron例（15分毎）:
#   */15 * * * * /home/ubuntu/seta-hp/scripts/monitor.sh >> /home/ubuntu/monitor.log 2>&1
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
STATE_FILE="${MONITOR_STATE_FILE:-$HOME/.monitor_state}"
COOLDOWN_SEC="${MONITOR_COOLDOWN_SEC:-10800}"          # 同一問題の再通知抑止(既定3h)
DISK_THRESHOLD="${MONITOR_DISK_PCT:-85}"               # ディスク使用率の警告閾値(%)
MEM_MIN_MB="${MONITOR_MEM_MIN_MB:-120}"                # 空きメモリの警告閾値(MB)
# health は持つが healthcheck が誤検知しがちなコンテナ（サイト到達で別途判定）
HEALTH_SKIP="${MONITOR_HEALTH_SKIP:-nginx_proxy}"
EXPECTED_CONTAINERS="${MONITOR_CONTAINERS:-next_app nginx_proxy mysql_db designer-prod-designer-backend-1 designer-prod-designer-frontend-1 designer-prod-designer-mysql-1}"
SITE_URL="${MONITOR_SITE_URL:-https://kaza-love.com/api/health}"
DESIGNER_URL="${MONITOR_DESIGNER_URL:-https://designer.kaza-love.com/}"

problems=""
add() { problems+="- $1"$'\n'; }

# --- コンテナ稼働・health ---
for c in $EXPECTED_CONTAINERS; do
  st="$(docker inspect --format '{{.State.Status}}' "$c" 2>/dev/null || echo missing)"
  if [ "$st" != "running" ]; then add "コンテナ $c が起動していない (状態: $st)"; continue; fi
  case " $HEALTH_SKIP " in *" $c "*) : ;; *)
    hc="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "$c" 2>/dev/null)"
    [ "$hc" = "unhealthy" ] && add "コンテナ $c が unhealthy"
  ;; esac
done

# --- サイト到達(end-to-end) ---
code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "$SITE_URL" 2>/dev/null || echo 000)"
[ "$code" = "200" ] || add "サイト($SITE_URL)が異常 (HTTP $code)"
# designer はゲートで未ログインは 302。502/000 等なら異常。
dcode="$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "$DESIGNER_URL" 2>/dev/null || echo 000)"
case "$dcode" in 200|301|302|401|403) : ;; *) add "designer($DESIGNER_URL)が異常 (HTTP $dcode)";; esac

# --- ディスク ---
disk="$(df / | awk 'NR==2{gsub("%","",$5); print $5}')"
[ "${disk:-0}" -ge "$DISK_THRESHOLD" ] && add "ディスク使用率 ${disk}% (閾値 ${DISK_THRESHOLD}%)"

# --- メモリ ---
memav="$(free -m | awk 'NR==2{print $7}')"
[ "${memav:-9999}" -lt "$MEM_MIN_MB" ] && add "空きメモリ ${memav}MB (閾値 ${MEM_MIN_MB}MB)"

ts="$(date '+%Y-%m-%d %H:%M:%S')"
if [ -z "$problems" ]; then
  echo "[$ts] OK"
  rm -f "$STATE_FILE"
  exit 0
fi

printf '[%s] 異常検知:\n%s' "$ts" "$problems"

# --- クールダウン（同一問題の連続通知を抑止） ---
hash_now="$(printf '%s' "$problems" | md5sum | cut -d' ' -f1)"
now="$(date +%s)"
if [ -f "$STATE_FILE" ]; then
  read -r last_hash last_ts < "$STATE_FILE" 2>/dev/null || true
  if [ "${last_hash:-}" = "$hash_now" ] && [ "$(( now - ${last_ts:-0} ))" -lt "$COOLDOWN_SEC" ]; then
    echo "[$ts] 同一問題のためメール抑止(cooldown中)"
    exit 0
  fi
fi
echo "$hash_now $now" > "$STATE_FILE"

# --- メール通知（SMTP from next/.env） ---
set -a; [ -f "$PROJECT_DIR/next/.env" ] && . "$PROJECT_DIR/next/.env"; set +a
ALERT_TO="${MONITOR_ALERT_TO:-${CONTACT_TO_EMAIL:-${SMTP_USER:-}}}"
if [ -n "${SMTP_HOST:-}" ] && [ -n "$ALERT_TO" ]; then
  export MAIL_TO="$ALERT_TO"
  export MAIL_SUBJECT="[kaza-love監視] 異常検知 $ts"
  export MAIL_BODY="サーバー($(hostname))で異常を検知しました。

${problems}
-- 自動監視 scripts/monitor.sh"
  export SMTP_HOST SMTP_PORT="${SMTP_PORT:-587}" SMTP_USER="${SMTP_USER:-}" SMTP_PASS="${SMTP_PASS:-}"
  python3 - <<'PY'
import os, smtplib, ssl
from email.message import EmailMessage
msg = EmailMessage()
msg["Subject"] = os.environ["MAIL_SUBJECT"]
msg["From"] = os.environ.get("SMTP_USER") or os.environ["MAIL_TO"]
msg["To"] = os.environ["MAIL_TO"]
msg.set_content(os.environ["MAIL_BODY"])
host = os.environ["SMTP_HOST"]; port = int(os.environ.get("SMTP_PORT", "587"))
user = os.environ.get("SMTP_USER"); pw = os.environ.get("SMTP_PASS")
try:
    if port == 465:
        srv = smtplib.SMTP_SSL(host, port, timeout=20)
    else:
        srv = smtplib.SMTP(host, port, timeout=20)
        srv.starttls(context=ssl.create_default_context())
    if user and pw:
        srv.login(user, pw)
    srv.send_message(msg); srv.quit()
    print("alert mail sent to", os.environ["MAIL_TO"])
except Exception as e:
    print("alert mail FAILED:", e)
PY
else
  echo "[$ts] SMTP未設定のためメール送信スキップ(ログのみ)"
fi
