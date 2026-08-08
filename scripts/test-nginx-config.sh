#!/bin/bash
# HTTPS設定を実際に生成し、構文とDesigner認証境界の必須directiveを検証する。
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
TMP_DIR="$(mktemp -d)"
cleanup() {
  chmod -R u+rwX "$TMP_DIR" 2>/dev/null || true
  rm -rf -- "$TMP_DIR"
}
trap cleanup EXIT

mkdir -p "$TMP_DIR/conf.d" "$TMP_DIR/certs/live/test.local" "$TMP_DIR/certbot" "$TMP_DIR/uploads"
cp "$PROJECT_DIR/nginx/default.conf.template" "$TMP_DIR/conf.d/default.conf.template"
openssl req -x509 -nodes -newkey rsa:2048 -days 1 -subj /CN=test.local \
  -keyout "$TMP_DIR/certs/live/test.local/privkey.pem" \
  -out "$TMP_DIR/certs/live/test.local/fullchain.pem" >/dev/null 2>&1

docker run --rm \
  --add-host next_app:127.0.0.1 \
  --entrypoint /bin/sh \
  -e SERVER_NAME=test.local \
  -e OLD_SERVER_NAME=old.test.local \
  -e PROXY_SSO_SECRET=test-shared-secret \
  -e ADMIN_ALLOWED_IPS= \
  -e NGINX_TEST_ONLY=1 \
  -v "$TMP_DIR/conf.d:/etc/nginx/conf.d" \
  -v "$TMP_DIR/certs:/etc/letsencrypt:ro" \
  -v "$TMP_DIR/certbot:/var/www/certbot:ro" \
  -v "$TMP_DIR/uploads:/var/www/uploads:ro" \
  -v "$PROJECT_DIR/nginx/docker-entrypoint.sh:/docker-entrypoint.sh:ro" \
  nginx:1.27-alpine /docker-entrypoint.sh

CONFIG="$TMP_DIR/conf.d/default.conf"
COMMON="$TMP_DIR/conf.d/designer_authenticated_backend.inc"

assert_line() {
  local expected="$1"
  if ! grep -Fqx "$expected" "$COMMON"; then
    echo "Designer共通includeに必須directiveがありません: $expected" >&2
    exit 1
  fi
}

assert_line 'auth_request /__auth;'
assert_line 'auth_request_set $auth_email $upstream_http_x_user_email;'
assert_line 'proxy_pass $designer_back;'
assert_line 'include /etc/nginx/conf.d/proxy_headers.inc;'
assert_line 'proxy_set_header Cookie $designer_cookie;'
assert_line 'proxy_set_header X-Remote-User $auth_email;'
assert_line 'proxy_set_header X-SSO-Auth "test-shared-secret";'

include_count="$(grep -Fc 'include /etc/nginx/conf.d/designer_authenticated_backend.inc;' "$CONFIG" || true)"
if [ "$include_count" -ne 2 ]; then
  echo "Designer共通includeは/apiと/adminの2箇所で必要です (actual=$include_count)" >&2
  exit 1
fi
if grep -Fq 'proxy_set_header X-SSO-Auth' "$CONFIG"; then
  echo "X-SSO-Authが共通include外に重複しています" >&2
  exit 1
fi

api_block="$(awk '/server_name designer\.test\.local;/{designer=1} designer && /location \/api\/ \{/{capture=1} capture{print} capture && /^    }/{exit}' "$CONFIG")"
admin_block="$(awk '/server_name designer\.test\.local;/{designer=1} designer && /location \/admin\/ \{/{capture=1} capture{print} capture && /^    }/{exit}' "$CONFIG")"
if ! grep -Fq 'include /etc/nginx/conf.d/proxy_timeouts.inc;' <<< "$api_block"; then
  echo "Designer APIのtimeout設定が失われています" >&2
  exit 1
fi
if grep -Fq 'include /etc/nginx/conf.d/proxy_timeouts.inc;' <<< "$admin_block"; then
  echo "Designer adminへ意図しないtimeout差分が混入しています" >&2
  exit 1
fi

echo "Nginx HTTPS config and Designer auth boundary: OK"
