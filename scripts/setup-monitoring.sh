#!/bin/bash
# サーバー監視一括セットアップスクリプト
# 使用方法: sudo bash scripts/setup-monitoring.sh

set -e

echo "=========================================="
echo "サーバー監視セットアップ開始"
echo "=========================================="

# rootチェック
if [ "$EUID" -ne 0 ]; then
    echo "このスクリプトはroot権限で実行してください"
    echo "使用方法: sudo bash $0"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# ----------------------------------
# 1. 必要パッケージのインストール
# ----------------------------------
echo ""
echo "1. 必要パッケージをインストール中..."
apt-get update
apt-get install -y fail2ban logwatch mailutils

# ----------------------------------
# 2. fail2ban設定
# ----------------------------------
echo ""
echo "2. fail2ban設定中..."

# jail.localをコピー
if [ -f "$PROJECT_DIR/fail2ban/jail.local" ]; then
    cp "$PROJECT_DIR/fail2ban/jail.local" /etc/fail2ban/jail.local
    echo "jail.local をコピーしました"
fi

# nginx-404フィルターをコピー
if [ -f "$PROJECT_DIR/fail2ban/filter.d/nginx-404.conf" ]; then
    cp "$PROJECT_DIR/fail2ban/filter.d/nginx-404.conf" /etc/fail2ban/filter.d/
    echo "nginx-404.conf をコピーしました"
fi

# fail2ban再起動
systemctl enable fail2ban
systemctl restart fail2ban
echo "fail2ban を有効化・再起動しました"

# ----------------------------------
# 3. logwatch設定
# ----------------------------------
echo ""
echo "3. logwatch設定中..."

if [ -f "$PROJECT_DIR/logwatch/logwatch.conf" ]; then
    cp "$PROJECT_DIR/logwatch/logwatch.conf" /etc/logwatch/conf/logwatch.conf
    echo "logwatch.conf をコピーしました"
fi

# ----------------------------------
# 4. cron設定
# ----------------------------------
echo ""
echo "4. cron設定中..."

# cronジョブを追加（既存の設定を上書きしないよう確認）
CRON_FILE="/etc/cron.d/server-monitoring"

cat > "$CRON_FILE" << EOF
# サーバー監視用cronジョブ
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

# SSL証明書更新（毎月1日 3:00）
0 3 1 * * root $PROJECT_DIR/scripts/renew-ssl.sh >> /var/log/certbot-renew.log 2>&1

# DBバックアップ（毎日 4:00）
0 4 * * * root $PROJECT_DIR/scripts/backup-db.sh >> /var/log/db-backup.log 2>&1

# サービス監視（5分ごと）
*/5 * * * * root $PROJECT_DIR/scripts/monitor.sh >> /var/log/monitor.log 2>&1

# logwatch日次レポート（毎朝 7:00）
0 7 * * * root /usr/sbin/logwatch --output mail
EOF

chmod 644 "$CRON_FILE"
echo "cronジョブを設定しました: $CRON_FILE"

# ----------------------------------
# 5. スクリプトに実行権限付与
# ----------------------------------
echo ""
echo "5. スクリプトに実行権限を付与中..."
chmod +x "$PROJECT_DIR/scripts/"*.sh
echo "完了"

# ----------------------------------
# 6. バックアップディレクトリ作成
# ----------------------------------
echo ""
echo "6. バックアップディレクトリを作成中..."
mkdir -p "$PROJECT_DIR/backups"
chmod 700 "$PROJECT_DIR/backups"
echo "完了: $PROJECT_DIR/backups"

# ----------------------------------
# 完了メッセージ
# ----------------------------------
echo ""
echo "=========================================="
echo "セットアップ完了!"
echo "=========================================="
echo ""
echo "設定内容:"
echo "  - fail2ban: SSH(3回失敗→24h BAN), Nginx(bot・404連打ブロック)"
echo "  - logwatch: 毎朝7:00にログサマリーをメール送信"
echo "  - monitor.sh: 5分ごとにコンテナ状態チェック"
echo "  - backup-db.sh: 毎日4:00にDBバックアップ"
echo "  - renew-ssl.sh: 毎月1日3:00にSSL証明書更新"
echo ""
echo "fail2ban状態確認:"
echo "  fail2ban-client status"
echo ""
echo "logwatch手動実行:"
echo "  logwatch --output stdout --detail High"
echo ""
