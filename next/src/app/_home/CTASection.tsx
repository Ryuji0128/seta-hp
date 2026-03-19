"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import Link from "next/link";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const CTASection = () => {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: "white",
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            textAlign: "center",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: "#333",
              mb: 2,
              fontSize: { xs: "1.25rem", md: "1.5rem" },
              lineHeight: 1.5,
            }}
          >
            お気軽にお問い合わせください
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#666",
              mb: 4,
              lineHeight: 1.8,
              fontSize: "14px",
            }}
          >
            商品に関するご質問など、
            <br />
            お気軽にご連絡ください。
          </Typography>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" passHref>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: "#FF5722",
                  color: "white",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: "50px",
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "#E64A19",
                    boxShadow: "0 4px 12px rgba(255, 87, 34, 0.3)",
                  },
                }}
              >
                お問い合わせ
              </Button>
            </Link>
            <Link href="/gallery" passHref>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  color: "#333",
                  borderColor: "#DDD",
                  px: 4,
                  py: 1.5,
                  borderRadius: "50px",
                  "&:hover": {
                    borderColor: "#333",
                    bgcolor: "transparent",
                  },
                }}
              >
                作品例を見る
              </Button>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CTASection;
