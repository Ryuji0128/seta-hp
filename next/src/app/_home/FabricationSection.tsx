"use client";

import { Box, Card, CardContent, Container, Grid, Typography } from "@mui/material";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import PrintIcon from "@mui/icons-material/Print";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import BuildIcon from "@mui/icons-material/Build";

const services = [
  {
    icon: <ViewInArIcon sx={{ fontSize: 48 }} />,
    title: "3Dモデリング",
    description: "CADを使った3Dデータの作成。設計から形状検討までサポートします。",
  },
  {
    icon: <PrintIcon sx={{ fontSize: 48 }} />,
    title: "3Dプリント出力",
    description: "FDM・SLA等の3Dプリンタで、データを実際のカタチにします。",
  },
  {
    icon: <ContentCutIcon sx={{ fontSize: 48 }} />,
    title: "レーザーカット",
    description: "アクリル、木材などの素材をレーザー加工機で精密にカットします。",
  },
  {
    icon: <BuildIcon sx={{ fontSize: 48 }} />,
    title: "モックアップ作成",
    description: "試作品・プロトタイプの制作。アイデアを素早くカタチにします。",
  },
];

const FabricationSection = () => {
  return (
    <Box
      sx={{
        py: 10,
        bgcolor: "primary.main",
        color: "white",
      }}
    >
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
            3Dモデル＆試作
          </Typography>
          <Typography
            variant="h6"
            sx={{ opacity: 0.9, fontWeight: 400 }}
          >
            3Dデータからカタチにするものづくり
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
                  bgcolor: "rgba(255,255,255,0.95)",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
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
                    sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}
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

export default FabricationSection;
