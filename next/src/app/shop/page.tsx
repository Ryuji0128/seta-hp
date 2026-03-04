import type { Metadata } from "next";
import { Box, Container, Typography } from "@mui/material";
import PageMainTitle from "@/components/PageMainTitle";
import BaseContainer from "@/components/BaseContainer";
import ShopContent from "./ShopContent";

export const metadata: Metadata = {
  title: "販売 | 3Dプリント＆レーザーカット製品",
  description:
    "瀬田製作所の販売ページ。3Dプリント製品やレーザーカット製品をオンラインでご購入いただけます。",
  keywords: ["3Dプリント", "レーザーカット", "販売", "オンラインショップ", "ものづくり"],
  alternates: {
    canonical: "/shop",
  },
};

export default function ShopPage() {
  return (
    <Box>
      <BaseContainer>
        <PageMainTitle japanseTitle="販売" englishTitle="Shop" />
      </BaseContainer>

      <Container maxWidth="lg" sx={{ pb: 10 }}>
        <Typography variant="body1" sx={{ textAlign: "center", mb: 8, color: "text.secondary", lineHeight: 2 }}>
          3Dプリント・レーザーカットで作った製品を販売しています。
          <br />
          オリジナルのものづくり製品をお届けします。
        </Typography>

        <ShopContent />
      </Container>
    </Box>
  );
}
