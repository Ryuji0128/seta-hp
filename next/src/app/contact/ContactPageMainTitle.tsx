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
          : "特注品・大量注文・取扱店のご相談など、お気軽にどうぞ。"
      }
    />
  );
};

export default ContactPageMainTitle;
