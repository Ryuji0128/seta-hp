"use client";

import { SessionProvider } from "next-auth/react";
import UserAuthButton from "@/components/UserAuthButton";

/**
 * SessionProvider + 認証ボタンのまとまり。
 * Header から next/dynamic で遅延読み込みし、
 * next-auth のクライアントJSを初期バンドルから分離する（#245）。
 */
export default function UserAuthMenu() {
  return (
    <SessionProvider>
      <UserAuthButton />
    </SessionProvider>
  );
}
