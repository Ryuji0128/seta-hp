import "server-only";

export function isGoogleAuthEnabled(): boolean {
  return (
    process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true" &&
    Boolean(process.env.GOOGLE_CLIENT_ID) &&
    Boolean(process.env.GOOGLE_CLIENT_SECRET)
  );
}

export function isRecaptchaEnabled(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY &&
      process.env.RECAPTCHA_SECRET_KEY
  );
}
