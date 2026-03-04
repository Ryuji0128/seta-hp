import type { Metadata } from "next";
import { Box, Container, Typography } from "@mui/material";
import PageMainTitle from "@/components/PageMainTitle";
import BaseContainer from "@/components/BaseContainer";
import WorksContent from "./WorksContent";

export const metadata: Metadata = {
  title: "制作事例 | 3Dモデル＆試作",
  description:
    "瀬田製作所の制作事例。3Dモデリング、3Dプリント、レーザーカット、モックアップ作成などの実績をご紹介します。",
  keywords: ["制作事例", "3Dプリント", "レーザーカット", "モックアップ", "試作品"],
  alternates: {
    canonical: "/works",
  },
};

export default function WorksPage() {
  return (
    <Box>
      <BaseContainer>
        <PageMainTitle japanseTitle="制作事例" englishTitle="Works" />
      </BaseContainer>

      <Container maxWidth="lg" sx={{ pb: 10 }}>
        <Typography variant="body1" sx={{ textAlign: "center", mb: 8, color: "text.secondary", lineHeight: 2 }}>
          3Dモデリング、3Dプリント、レーザーカットなど
          <br />
          これまでの制作事例をご紹介します。
        </Typography>

        <WorksContent />
      </Container>
    </Box>
  );
}
