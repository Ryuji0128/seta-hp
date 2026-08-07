import PageHero from "@/components/PageHero";

interface Props {
  titleJa: string;
  titleEn: string;
  lead: string;
}

const ContactPageHero: React.FC<Props> = ({ titleJa, titleEn, lead }) => (
  <PageHero
    variant="contact"
    eyebrow="Contact · お問い合わせ"
    heading={titleJa}
    subtitle={<>— {titleEn}</>}
    description={lead}
  />
);

export default ContactPageHero;
