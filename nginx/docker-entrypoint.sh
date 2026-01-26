#!/bin/sh
set -e

CERT_PATH="/etc/letsencrypt/live/setaseisakusyo.com/fullchain.pem"

# 環境変数を展開
envsubst '${SERVER_NAME}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# SSL証明書が存在する場合、HTTPS設定を追加
if [ -f "$CERT_PATH" ]; then
    echo "SSL certificate found. Enabling HTTPS..."
    cat >> /etc/nginx/conf.d/default.conf << 'EOF'

# HTTPS
server {
    listen 443 ssl;
    server_name ${SERVER_NAME};

    ssl_certificate /etc/letsencrypt/live/setaseisakusyo.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/setaseisakusyo.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    client_max_body_size 10M;

    location / {
        proxy_pass http://next_app:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_set_header Upgrade $http_upgrade;
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
}
EOF
    # SERVER_NAME を再度展開
    sed -i "s/\${SERVER_NAME}/${SERVER_NAME}/g" /etc/nginx/conf.d/default.conf
else
    echo "SSL certificate not found. Running HTTP only..."
    # HTTPSリダイレクトを無効化し、HTTPで直接サービス
    cat > /etc/nginx/conf.d/default.conf << EOF
server {
    listen 80;
    server_name ${SERVER_NAME};

    client_max_body_size 10M;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
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
}
EOF
fi

exec nginx -g 'daemon off;'
