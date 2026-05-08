"use client";

import { Box, Card, CardContent, Container, Grid, Typography } from "@mui/material";
import { ReactNode } from "react";

interface ServiceItem {
  icon: ReactNode;
  title: string;
  description: string;
}

interface ServiceCardGridProps {
  title: string;
  subtitle: string;
  services: ServiceItem[];
  bgColor?: string;
  textColor?: string;
  cardBgColor?: string;
  hoverShadow?: string;
}

export default function ServiceCardGrid({
  title,
  subtitle,
  services,
  bgColor = "background.default",
  textColor,
  cardBgColor,
  hoverShadow = "0 12px 40px rgba(0,0,0,0.12)",
}: ServiceCardGridProps) {
  return (
    <Box sx={{ py: 10, bgcolor: bgColor, color: textColor }}>
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
            {title}
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: textColor ? undefined : "text.secondary", opacity: textColor ? 0.9 : 1, fontWeight: 400 }}
          >
            {subtitle}
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
                  bgcolor: cardBgColor,
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: hoverShadow,
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
                    sx={{ fontWeight: 600, mb: 2, color: cardBgColor ? "text.primary" : undefined }}
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
}
