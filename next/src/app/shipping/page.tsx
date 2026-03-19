import { Box, Container, Typography, Paper } from "@mui/material";
import type { Metadata } from "next";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LoopIcon from "@mui/icons-material/Loop";

export const metadata: Metadata = {
  title: "配送・返品について | SETA Craft",
  description: "SETA Craftの配送方法・送料・返品ポリシーについてご案内します。",
  alternates: {
    canonical: "/shipping",
  },
};

export default function ShippingPage() {
  return (
    <Box sx={{ bgcolor: "white", minHeight: "100vh" }}>
      {/* ヘッダー */}
      <Box
        sx={{
          borderBottom: "1px solid #EAEAEA",
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.5rem", md: "1.8rem" },
              color: "#333",
            }}
          >
            配送・返品について
          </Typography>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 4, md: 6 } }}>
        <Container maxWidth="md">
          {/* 配送について */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2, border: "1px solid #EAEAEA", boxShadow: "none" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <LocalShippingIcon sx={{ fontSize: 24, color: "#FF5722", mr: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#333", fontSize: "1rem" }}>
                配送について
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: "#333", fontSize: "13px" }}>
              配送方法
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.8, color: "#666", fontSize: "13px" }}>
              ゆうパック、クリックポスト、レターパックのいずれかでお届けします。
              商品のサイズ・数量に応じて最適な配送方法を選択いたします。
            </Typography>

            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: "#333", fontSize: "13px" }}>
              送料
            </Typography>
            <Box component="ul" sx={{ pl: 2, mb: 2, "& li": { fontSize: "13px", color: "#666", mb: 0.5 } }}>
              <li>クリックポスト：全国一律 185円</li>
              <li>レターパックライト：全国一律 370円</li>
              <li>レターパックプラス：全国一律 520円</li>
              <li>ゆうパック：地域により異なります</li>
            </Box>
            <Typography variant="body2" sx={{ color: "#FF5722", mb: 2, fontSize: "13px", fontWeight: 500 }}>
              ※3,980円以上のご購入で送料無料
            </Typography>

            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: "#333", fontSize: "13px" }}>
              お届け日数
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.8, color: "#666", fontSize: "13px" }}>
              ご注文確認後、通常3〜7営業日以内に発送いたします。
              受注生産品の場合は、商品ページに記載の日数をご確認ください。
            </Typography>
          </Paper>

          {/* 返品・交換について */}
          <Paper sx={{ p: 3, borderRadius: 2, border: "1px solid #EAEAEA", boxShadow: "none" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <LoopIcon sx={{ fontSize: 24, color: "#FF5722", mr: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#333", fontSize: "1rem" }}>
                返品・交換について
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: "#333", fontSize: "13px" }}>
              返品・交換の条件
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.8, color: "#666", fontSize: "13px" }}>
              商品到着後7日以内にメールにてご連絡ください。
            </Typography>

            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: "#333", fontSize: "13px" }}>
              お客様都合の返品
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.8, color: "#666", fontSize: "13px" }}>
              未開封・未使用の商品に限り、返品をお受けいたします。返送料はお客様のご負担となります。
              ※受注生産品・オーダーメイド品は返品をお受けできません。
            </Typography>

            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: "#333", fontSize: "13px" }}>
              不良品・誤配送の場合
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.8, color: "#666", fontSize: "13px" }}>
              商品に不良があった場合、または誤った商品が届いた場合は、
              送料当店負担にて交換または返金いたします。商品到着後7日以内にご連絡ください。
            </Typography>

            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: "#333", fontSize: "13px" }}>
              返金方法
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.8, color: "#666", fontSize: "13px" }}>
              ご返金はお支払い方法に応じて行います。
              クレジットカードの場合はカード会社経由、銀行振込の場合はご指定の口座へお振込みいたします。
            </Typography>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
