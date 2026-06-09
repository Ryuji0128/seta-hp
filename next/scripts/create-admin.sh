#!/bin/sh

set -eu

echo "Create admin user"

printf "ADMIN_EMAIL: "
IFS= read -r ADMIN_EMAIL

printf "ADMIN_NAME [管理者]: "
IFS= read -r ADMIN_NAME

printf "ADMIN_PASSWORD: "
stty -echo
IFS= read -r ADMIN_PASSWORD
stty echo
printf "\n"

ADMIN_NAME=${ADMIN_NAME:-管理者}

if [ -z "$ADMIN_EMAIL" ]; then
  echo "ADMIN_EMAIL は必須です。"
  exit 1
fi

if [ ${#ADMIN_PASSWORD} -lt 8 ]; then
  echo "ADMIN_PASSWORD は8文字以上で入力してください。"
  exit 1
fi

export ADMIN_EMAIL
export ADMIN_NAME
export ADMIN_PASSWORD

npx prisma db seed
