#!/bin/sh
set -e

CERT_PATH="/etc/letsencrypt/live/${SERVER_NAME}/fullchain.pem"

# 環境変数を展開
envsubst '${SERVER_NAME} ${OLD_SERVER_NAME}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# SSL証明書が存在する場合、HTTPS設定を追加
if [ -f "$CERT_PATH" ]; then
    echo "SSL certificate found. Enabling HTTPS..."
    cat >> /etc/nginx/conf.d/default.conf << EOFCONF

# レート制限ゾーン定義
limit_req_zone \$binary_remote_addr zone=general:10m rate=10r/s;
limit_req_zone \$binary_remote_addr zone=api:10m rate=30r/m;
limit_req_zone \$binary_remote_addr zone=upload:10m rate=120r/m;
# designer 用（未認証フラッドが auth_request を過負荷にするのを抑止。対話ツールなので緩め）。
limit_req_zone \$binary_remote_addr zone=designer:10m rate=15r/s;

# Designer upstream へ渡す前に HP の SSO セッションCookieを除去するフィルタ。
# designer 自身の csrftoken / sessionid は残し、HPのJWT Cookieだけ落とす。
# secure/非secure 名、および Auth.js のchunk(.0/.1…)を「連続する複数個まとめて」除去する
# （末尾の "+" が連続chunkに対応）。現状のJWTサイズではchunkは発生しない想定だが将来耐性として。
map \$http_cookie \$designer_cookie {
    default \$http_cookie;
    "~*^(.*?)(?:(?:__Secure-)?kazalove\.session-token(?:\.[0-9]+)?=[^;]*;?\s*)+(.*)\$" "\$1\$2";
}

# 逆向き: HP の verify-admin(/__auth) へは「HPのSSO Cookie(全chunk)だけ」を渡す。
# designer 自身の sessionid/csrftoken を HP 側に漏らさないための境界。
map \$http_cookie \$sso_only_cookie {
    default "";
    "~*(?:^|;\s*)((?:(?:__Secure-)?kazalove\.session-token(?:\.[0-9]+)?=[^;]*;?\s*)+)" "\$1";
}

# HTTPS メインサイト (kaza-love.com)
server {
    listen 443 ssl;
    server_name ${SERVER_NAME};

    ssl_certificate /etc/letsencrypt/live/${SERVER_NAME}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${SERVER_NAME}/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305;
    ssl_prefer_server_ciphers on;

    # セキュリティヘッダー（HSTS / X-Frame-Options / X-Content-Type-Options /
    # Referrer-Policy / Permissions-Policy / CSP）は Next 側 next.config.ts の
    # headers() に一本化している（旧: ここと二重付与で HSTS の max-age も食い違っていた）。
    # 直配信の /uploads には MIME スニフ防止のみ各ロケーションで付与する。

    client_max_body_size 10M;

    location / {
        limit_req zone=general burst=20 nodelay;
        proxy_pass http://next_app:3000;
        proxy_http_version 1.1;

        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /api/ {
        limit_req zone=api burst=10 nodelay;
        proxy_pass http://next_app:3000;
        proxy_http_version 1.1;

        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location = /api/upload {
        limit_req zone=upload burst=20 nodelay;
        proxy_pass http://next_app:3000;
        proxy_http_version 1.1;

        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location = /api/admin/upload {
        limit_req zone=upload burst=20 nodelay;
        proxy_pass http://next_app:3000;
        proxy_http_version 1.1;

        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /uploads/ {
        alias /var/www/uploads/;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
        add_header X-Content-Type-Options "nosniff" always;
    }

    location /_next/static/ {
        proxy_pass http://next_app:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /static/ {
        proxy_pass http://next_app:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # public/ 直下の静的アセット（ロゴ・favicon・og-image 等）に長期キャッシュを付与。
    # ルート直下のファイルのみに限定し、/uploads/ や /_next/static/ は侵さない。
    location ~* ^/[^/]+\.(?:png|jpg|jpeg|gif|svg|ico|webp|avif|woff2?)\$ {
        proxy_pass http://next_app:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_hide_header Cache-Control;
        add_header Cache-Control "public, max-age=604800" always;
        add_header X-Content-Type-Options "nosniff" always;
    }
}

# www.kaza-love.com → kaza-love.com リダイレクト (HTTPS)
server {
    listen 443 ssl;
    server_name www.${SERVER_NAME};

    ssl_certificate /etc/letsencrypt/live/${SERVER_NAME}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${SERVER_NAME}/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;

    return 301 https://${SERVER_NAME}\$request_uri;
}

# 旧ドメイン setaseisakusyo.com → kaza-love.com リダイレクト (HTTPS)
server {
    listen 443 ssl;
    server_name ${OLD_SERVER_NAME} www.${OLD_SERVER_NAME};

    ssl_certificate /etc/letsencrypt/live/${SERVER_NAME}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${SERVER_NAME}/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;

    return 301 https://${SERVER_NAME}\$request_uri;
}

# designer.kaza-love.com（飾Love Designer / HP管理者ログインでSSOゲート）
server {
    listen 443 ssl;
    server_name designer.${SERVER_NAME};

    ssl_certificate /etc/letsencrypt/live/${SERVER_NAME}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${SERVER_NAME}/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305;
    ssl_prefer_server_ciphers on;

    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
    # CSP: designer フロントは外部リソース依存ゼロ（CDN/外部フォント/Worker無し）を確認済。
    # Next の hydration 用に script/style は unsafe-inline/eval を許可、画像生成用に data:/blob:。
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; worker-src 'self' blob:; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'" always;

    client_max_body_size 20M;

    # Designer は別composeスタック。落ちていても HP nginx 起動を妨げないよう
    # Docker埋め込みDNS(127.0.0.11)で実行時解決する（未起動時は502を返すだけ）。
    resolver 127.0.0.11 valid=30s ipv6=off;
    set \$designer_front http://designer-frontend:3000;
    set \$designer_back  http://designer-backend:8000;

    # 未ログイン(401)→HPログイン / 権限不足(403)→専用メッセージ で分ける。
    error_page 401 = @to_login;
    error_page 403 = @forbidden;
    location @to_login {
        return 302 https://${SERVER_NAME}/login;
    }
    location @forbidden {
        default_type text/html;
        return 403 "<!doctype html><meta charset=utf-8><title>403 Forbidden</title><body style='font-family:sans-serif;max-width:40rem;margin:3rem auto;padding:0 1rem;line-height:1.7'><h1>アクセス権限がありません</h1><p>このツールは管理者(ADMIN)アカウントのみ利用できます。別の権限でログインしている場合は、管理者アカウントでログインし直してください。</p><p><a href='https://${SERVER_NAME}/'>トップへ戻る</a></p></body>";
    }

    # auth_request: HP の管理者検証。Cookie は HP の SSO Cookie だけに絞って渡す
    # （designer 自身の sessionid/csrftoken を HP 側へ渡さない＝Cookie境界を明確化）。
    location = /__auth {
        internal;
        proxy_pass http://next_app:3000/api/auth/verify-admin;
        proxy_pass_request_body off;
        proxy_set_header Content-Length "";
        proxy_set_header Host ${SERVER_NAME};
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Cookie \$sso_only_cookie;
    }

    # Designer API（同一オリジン → CORS不要）。
    location /api/ {
        limit_req zone=designer burst=30 nodelay;
        auth_request /__auth;
        auth_request_set \$auth_email \$upstream_http_x_user_email;
        proxy_pass \$designer_back;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        # ★HPセッションCookieは Designer に渡さない（designer自身のcsrf/sessionのみ）。
        proxy_set_header Cookie \$designer_cookie;
        # ★なりすまし対策: クライアント供給の X-Remote-User を必ず上書き。
        proxy_set_header X-Remote-User \$auth_email;
        # ★同一network内の他コンテナからの偽装防止: 共有秘密(未設定なら空=Django側も非強制)。
        proxy_set_header X-SSO-Auth "${PROXY_SSO_SECRET}";
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Django admin（到達者は全員HPのADMIN。SSO側で is_staff/superuser を付与済み）。
    location /admin/ {
        limit_req zone=designer burst=30 nodelay;
        auth_request /__auth;
        auth_request_set \$auth_email \$upstream_http_x_user_email;
        proxy_pass \$designer_back;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Cookie \$designer_cookie;
        proxy_set_header X-Remote-User \$auth_email;
        proxy_set_header X-SSO-Auth "${PROXY_SSO_SECRET}";
    }

    # Django / DRF の静的ファイル。Cookie不要なので全除去。
    location /static/ {
        limit_req zone=designer burst=30 nodelay;
        auth_request /__auth;
        proxy_pass \$designer_back;
        proxy_set_header Host \$host;
        proxy_set_header Cookie "";
    }

    # Designer フロント（UIもゲート）。HPのCookieは一切渡さない。
    location / {
        limit_req zone=designer burst=30 nodelay;
        auth_request /__auth;
        proxy_pass \$designer_front;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Cookie "";
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOFCONF
else
    echo "SSL certificate not found. Running HTTP only..."
    cat > /etc/nginx/conf.d/default.conf << EOF
server {
    listen 80;
    server_name ${SERVER_NAME} ${OLD_SERVER_NAME} www.${SERVER_NAME} www.${OLD_SERVER_NAME};

    client_max_body_size 10M;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location = /api/upload {
        proxy_pass http://next_app:3000;
        proxy_http_version 1.1;

        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location = /api/admin/upload {
        proxy_pass http://next_app:3000;
        proxy_http_version 1.1;

        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location / {
        proxy_pass http://next_app:3000;
        proxy_http_version 1.1;

        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        proxy_set_header Upgrade \$http_upgrade;
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

    location /static/ {
        proxy_pass http://next_app:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /uploads/ {
        alias /var/www/uploads/;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
        add_header X-Content-Type-Options "nosniff" always;
    }
}
EOF
fi

exec nginx -g 'daemon off;'
