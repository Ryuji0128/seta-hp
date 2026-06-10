import { auth } from "@/lib/auth";
import ContactPageHero from "./ContactPageHero";

const ContactPageMainTitle = async () => {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <ContactPageHero
      titleJa={isAdmin ? "問い合わせ管理" : "お問い合わせ"}
      titleEn={isAdmin ? "Inquiry Management" : "Inquiry"}
      lead={
        isAdmin
          ? "受信したお問い合わせの一覧と対応状況を管理します。"
          : "商品に対する質問、カスタム対応のご相談などお気軽にお問い合わせください。"
      }
    />
  );
};

export default ContactPageMainTitle;
