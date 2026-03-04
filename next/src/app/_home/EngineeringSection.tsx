"use client";

import { Box, Card, CardContent, Container, Grid, Typography } from "@mui/material";
import MemoryIcon from "@mui/icons-material/Memory";
import WebIcon from "@mui/icons-material/Web";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard";

const services = [
  {
    icon: <MemoryIcon sx={{ fontSize: 48 }} />,
    title: "組み込みマイコン",
    description: "STM32、ESP32、PICなどのマイコンを使ったファームウェア開発を行います。",
  },
  {
    icon: <WebIcon sx={{ fontSize: 48 }} />,
    title: "Webアプリ開発",
    description: "ホームページ、業務システム、ECサイトなど、Webアプリケーションを開発します。",
  },
  {
    icon: <PhoneIphoneIcon sx={{ fontSize: 48 }} />,
    title: "モバイルアプリ",
    description: "iOS・Androidに対応したモバイルアプリケーションを開発します。",
  },
  {
    icon: <DeveloperBoardIcon sx={{ fontSize: 48 }} />,
    title: "電子回路設計",
    description: "基板設計から回路設計まで、電子回路のトータルサポートを行います。",
  },
];

const EngineeringSection = () => {
  return (
    <Box sx={{ py: 10, bgcolor: "background.default" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "2rem", md: "2.5rem" },
              mb: 2,
            }}
          >
            ソフト＆ハード開発
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "text.secondary", fontWeight: 400 }}
          >
            組み込みマイコンからホームページまで、幅広い受託開発
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: "100%",
                  textAlign: "center",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                  },
                }}
                elevation={2}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ color: "primary.main", mb: 2 }}>
                    {service.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    {service.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {service.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default EngineeringSection;
