import { Box } from "@mui/material";
import SectionContainer from "@/components/SectionContainer";
import AboutSectionHeader from "./AboutSectionHeader";
import { FONT_DISPLAY } from "@/theme/themeConstants";

const AboutStory = () => {
  return (
    <Box component="section" sx={{ py: { xs: 10, md: 15 } }}>
      <SectionContainer>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1.4fr" },
            gap: { xs: 4, md: 10 },
            mb: 8,
            alignItems: "baseline",
          }}
        >
          <AboutSectionHeader
            number="01"
            title="Story"
            titleJa="はじまり"
            marginBottom={0}
          />
          <Box />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1.4fr" },
            gap: { xs: 4, md: 10 },
          }}
        >
          <Box
            sx={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 500,
              fontSize: "clamp(32px, 3.8vw, 56px)",
              lineHeight: 1.2,
              letterSpacing: "-0.025em",
              color: "text.primary",
            }}
          >
            欲しいものが
            <br />
            なかったから、
            <br />
            <Box component="span" sx={{ color: "primary.main" }}>作った。</Box>
          </Box>

          <Box sx={{ pt: 2 }}>
            <Box sx={{ fontSize: "15.5px", color: "secondary.main", lineHeight: 2, mb: 3 }}>
              飾Love は、カード好きが営む小さな個人工房です。
            </Box>
            <Box sx={{ fontSize: "15.5px", color: "secondary.main", lineHeight: 2, mb: 3 }}>
              MLBカードを集めていると、「お気に入りのカードをもっとちゃんと飾りたい」
              「コレクションを見やすく整理したい」という気持ちが少しずつ強くなっていきました。
              けれど、いざ探してみると、自分が本当に納得できるディスプレイにはなかなか出会えません。
            </Box>
            <Box sx={{ fontSize: "15.5px", color: "secondary.main", lineHeight: 2, mb: 3 }}>
              ないなら、作ってみよう。
              <br />
              そう思って始めたのが、この工房です。
            </Box>
            <Box sx={{ fontSize: "15.5px", color: "secondary.main", lineHeight: 2 }}>
              レーザー加工で、自分が「これだ」と思える一品仕立てを、
              一つずつ手作業で組み立てています。同じカード好きの方に届くと嬉しいです。
            </Box>
          </Box>
        </Box>
      </SectionContainer>
    </Box>
  );
};

export default AboutStory;
