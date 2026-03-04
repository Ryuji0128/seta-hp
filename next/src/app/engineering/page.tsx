import type { Metadata } from "next";
import { Box, Card, CardContent, Container, Grid, Typography } from "@mui/material";
import PageMainTitle from "@/components/PageMainTitle";
import BaseContainer from "@/components/BaseContainer";
import MemoryIcon from "@mui/icons-material/Memory";
import WebIcon from "@mui/icons-material/Web";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard";

export const metadata: Metadata = {
  title: "ソフト＆ハード開発 | 受託開発",
  description:
    "瀬田製作所のソフト＆ハード開発サービス。組み込みマイコン、Webアプリ、モバイルアプリ、電子回路設計など幅広い受託開発を行います。",
  keywords: ["受託開発", "組み込み", "マイコン", "Webアプリ", "モバイルアプリ", "電子回路設計"],
  alternates: {
    canonical: "/engineering",
  },
};

const services = [
  {
    icon: <MemoryIcon sx={{ fontSize: 56 }} />,
    title: "組み込みマイコン開発",
    description:
      "STM32、ESP32、PIC、Arduinoなど各種マイコンを使用したファームウェア開発を行います。センサー制御、通信制御、モーター制御など、ハードウェアに近いソフトウェア開発が得意です。",
    features: ["STM32", "ESP32", "PIC", "Arduino", "Raspberry Pi", "RTOS"],
    examples: [
      "IoTデバイスのファームウェア開発",
      "産業機器の制御システム",
      "センサーデータ収集システム",
      "無線通信モジュールの制御",
    ],
  },
  {
    icon: <WebIcon sx={{ fontSize: 56 }} />,
    title: "Webアプリケーション開発",
    description:
      "コーポレートサイトから業務システムまで、Webアプリケーションの企画・設計・開発・運用を一貫して対応します。モダンな技術スタックで、保守性の高いシステムを構築します。",
    features: ["React", "Next.js", "TypeScript", "Node.js", "Python", "MySQL"],
    examples: [
      "コーポレートサイト制作",
      "ECサイト構築",
      "業務管理システム",
      "予約・決済システム",
    ],
  },
  {
    icon: <PhoneIphoneIcon sx={{ fontSize: 56 }} />,
    title: "モバイルアプリ開発",
    description:
      "iOS・Android両対応のモバイルアプリケーションを開発します。ネイティブ開発からクロスプラットフォーム開発まで、要件に合わせた最適な技術を選択します。",
    features: ["Flutter", "React Native", "Swift", "Kotlin", "Firebase"],
    examples: [
      "業務用モバイルアプリ",
      "IoT連携アプリ",
      "店舗向け顧客管理アプリ",
      "ヘルスケアアプリ",
    ],
  },
  {
    icon: <DeveloperBoardIcon sx={{ fontSize: 56 }} />,
    title: "電子回路設計",
    description:
      "回路設計から基板設計、試作、量産対応まで電子回路のトータルサポートを行います。デジタル回路、アナログ回路、電源回路など幅広く対応可能です。",
    features: ["回路設計", "基板設計", "KiCad", "部品選定", "EMC対策"],
    examples: [
      "センサーボード設計",
      "電源回路設計",
      "通信モジュール設計",
      "制御基板設計",
    ],
  },
];

export default function EngineeringPage() {
  return (
    <Box>
      <BaseContainer>
        <PageMainTitle japanseTitle="ソフト＆ハード開発" englishTitle="Software & Hardware" />
      </BaseContainer>

      <Container maxWidth="lg" sx={{ pb: 10 }}>
        <Typography variant="body1" sx={{ textAlign: "center", mb: 8, color: "text.secondary", lineHeight: 2 }}>
          組み込みマイコンからホームページまで、幅広い受託開発を行います。
          <br />
          ソフトウェアとハードウェアの両方の知見を活かし、最適なソリューションを提供します。
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
                          開発実績例
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
