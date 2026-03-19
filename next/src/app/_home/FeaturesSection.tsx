"use client";

import { Box, Container, Grid, Typography } from "@mui/material";
import HandymanIcon from "@mui/icons-material/Handyman";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import BrushIcon from "@mui/icons-material/Brush";

const features = [
  {
    icon: HandymanIcon,
    title: "丁寧な手作り",
    description: "一つ一つ丁寧に製作",
  },
  {
    icon: VerifiedUserIcon,
    title: "品質保証",
    description: "不良品は無償交換",
  },
  {
    icon: BrushIcon,
    title: "オーダーメイド",
    description: "準備中",
  },
  {
    icon: LocalShippingIcon,
    title: "全国配送",
    description: "3,980円以上で送料無料",
  },
];

const FeaturesSection = () => {
  return (
    <Box
      sx={{
        py: { xs: 5, md: 6 },
        bgcolor: "#FAFAFA",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Grid item xs={6} md={3} key={index}>
                <Box
                  sx={{
                    textAlign: "center",
                    py: 2,
                  }}
                >
                  <IconComponent
                    sx={{
                      fontSize: 32,
                      color: "#FF5722",
                      mb: 1.5,
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: "#333",
                      mb: 0.5,
                      fontSize: "14px",
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      fontSize: "12px",
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
