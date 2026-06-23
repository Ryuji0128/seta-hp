import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { isGoogleAuthEnabled } from "@/lib/runtime-config";
import { redirect } from "next/navigation";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "新規登録",
  robots: { index: false, follow: false },
};

export default async function RegisterPage() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return <RegisterForm isGoogleEnabled={isGoogleAuthEnabled()} />;
}
