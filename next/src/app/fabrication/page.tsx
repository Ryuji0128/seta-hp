import type { Metadata } from "next";
import { Box, Card, CardContent, Container, Grid, Typography } from "@mui/material";
import PageMainTitle from "@/components/PageMainTitle";
import BaseContainer from "@/components/BaseContainer";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import PrintIcon from "@mui/icons-material/Print";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import BuildIcon from "@mui/icons-material/Build";

export const metadata: Metadata = {
  title: "3Dモデル＆試作 | ものづくり",
  description:
    "瀬田製作所の3Dモデル＆試作サービス。3Dモデリング、3Dプリント、レーザーカット、モックアップ作成など、アイデアをカタチにします。",
  keywords: ["3Dプリント", "レーザーカット", "3Dモデリング", "試作", "モックアップ", "プロトタイプ"],
  alternates: {
    canonical: "/fabrication",
  },
};

const services = [
  {
    icon: <ViewInArIcon sx={{ fontSize: 56 }} />,
    title: "3Dモデリング",
    description:
      "CADソフトを使用した3Dデータの作成を行います。製品設計から形状検討、デザイン検証まで、お客様のアイデアを3Dデータとして具現化します。",
    features: ["Fusion 360", "SolidWorks", "FreeCAD", "Blender", "STEP/STL変換"],
    examples: [
      "製品筐体の設計",
      "治具・固定具の設計",
      "既存部品の3Dデータ化",
      "デザインモックアップ作成",
    ],
  },
  {
    icon: <PrintIcon sx={{ fontSize: 56 }} />,
    title: "3Dプリント出力",
    description:
      "FDM（熱溶解積層）方式やSLA（光造形）方式の3Dプリンタを使用し、3Dデータを実際のカタチにします。材質や精度の要件に応じた最適な出力方法を提案します。",
    features: ["FDM方式", "SLA方式", "PLA", "ABS", "レジン", "複数カラー対応"],
    examples: [
      "試作品の製作",
      "小ロット部品の製造",
      "展示用モデルの製作",
      "機能検証用プロトタイプ",
    ],
  },
  {
    icon: <ContentCutIcon sx={{ fontSize: 56 }} />,
    title: "レーザーカット",
    description:
      "レーザー加工機を使用し、アクリル、木材、MDFなどの素材を精密にカットします。彫刻加工も可能で、サインプレートやオリジナルグッズの製作にも対応します。",
    features: ["アクリル加工", "木材加工", "MDF", "彫刻加工", "精密カット"],
    examples: [
      "アクリルパネルの製作",
      "木製看板・サインプレート",
      "オリジナルグッズ製作",
      "ケース・筐体のパーツ",
    ],
  },
  {
    icon: <BuildIcon sx={{ fontSize: 56 }} />,
    title: "モックアップ作成",
    description:
      "3Dプリント、レーザーカット、手加工などを組み合わせて、アイデアを素早くカタチにします。製品開発の初期段階での検証やプレゼンテーション用のモデル作成を支援します。",
    features: ["複合加工", "塗装仕上げ", "組立対応", "短納期対応"],
    examples: [
      "製品コンセプトモデル",
      "プレゼン用モックアップ",
      "機能検証用試作",
      "展示会用デモ機",
    ],
  },
];

export default function FabricationPage() {
  return (
    <Box>
      <BaseContainer>
        <PageMainTitle japanseTitle="3Dモデル＆試作" englishTitle="3D Model & Prototyping" />
      </BaseContainer>

      <Container maxWidth="lg" sx={{ pb: 10 }}>
        <Typography variant="body1" sx={{ textAlign: "center", mb: 8, color: "text.secondary", lineHeight: 2 }}>
          3Dデータからカタチにするものづくり。
          <br />
          アイデアを素早く形にして、検証・改善のサイクルを加速します。
        </Typography>

        <Grid container spacing={5}>
          {services.map((service, index) => (
            <Grid item xs={12} key={index}>
              <Card
                sx={{
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                  },
                }}
                elevation={2}
              >
                <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                  <Grid container spacing={4} alignItems="flex-start">
                    <Grid item xs={12} md={8}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                        <Box sx={{ color: "primary.main" }}>{service.icon}</Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.main" }}>
                          {service.title}
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ mb: 3, color: "text.secondary", lineHeight: 2 }}>
                        {service.description}
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                        {service.features.map((feature, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              bgcolor: "primary.pale",
                              color: "primary.dark",
                              px: 2,
                              py: 0.5,
                              borderRadius: 1,
                              fontSize: "0.875rem",
                              fontWeight: 500,
                            }}
                          >
                            {feature}
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{
                          bgcolor: "grey.50",
                          borderRadius: 2,
                          p: 3,
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}>
                          製作実績例
                        </Typography>
                        <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                          {service.examples.map((example, idx) => (
                            <Box
                              component="li"
                              key={idx}
                              sx={{
                                color: "text.secondary",
                                fontSize: "0.9rem",
                                mb: 1,
                                "&::marker": { color: "primary.main" },
                              }}
                            >
                              {example}
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
