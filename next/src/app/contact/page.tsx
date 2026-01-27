import React from "react";
import type { Metadata } from "next";
import { ReCaptchaProvider } from "next-recaptcha-v3";
import ContactForm from "./ContactForm";
import ContactPageMainTitle from "./ContactPageMainTitle";
import { Box } from "@mui/material";
import { auth } from "@/lib/auth";
import InquiryManagement from "./InquiryManagement";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "瀬田製作所へのお問い合わせはこちらから。Web開発、アプリ開発のご相談・お見積りなど、お気軽にご連絡ください。",
  alternates: {
    canonical: "/contact",
  },
};

export default async function ContactPage() {
  // Todo: middleware若しくはauth.ts(config含む)にて同様の設定が可能、かつパフォーマンス向上が期待できるため、今後改修予定
  const session = await auth();

  return (
    <Box
      sx={{
        // backgroundImage: "url(/fusetsu_logo_background.png)",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <ReCaptchaProvider
        reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        useRecaptchaNet={true}
      >
        <ContactPageMainTitle />
        {session ? <InquiryManagement session={session} /> : <ContactForm />}
      </ReCaptchaProvider>
    </Box>
  );
}
