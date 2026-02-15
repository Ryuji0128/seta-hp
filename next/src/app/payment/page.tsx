"use client";

import { ReCaptchaProvider } from "next-recaptcha-v3";
import PaymentContent from "./PaymentContent";

export default function PaymentPage() {
  return (
    <ReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
      useRecaptchaNet={true}
    >
      <PaymentContent />
    </ReCaptchaProvider>
  );
}
