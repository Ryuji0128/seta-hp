import { Box, Container, Typography, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 | SETA Craft",
  description: "SETA Craftの特定商取引法に基づく表記です。",
  alternates: {
    canonical: "/legal",
  },
};

const legalInfo = [
  { label: "販売業者", value: "SETA Craft" },
  { label: "運営責任者", value: "木村竜次" },
  { label: "所在地", value: "※ご請求いただいた方にお知らせいたします" },
  { label: "電話番号", value: "※ご請求いただいた方にお知らせいたします" },
  { label: "メールアドレス", value: "info@setaseisakusyo.com" },
  { label: "販売価格", value: "各商品ページに記載" },
  { label: "商品代金以外の必要料金", value: "送料（商品ページに記載）" },
  { label: "支払方法", value: "クレジットカード、コンビニ決済、銀行振込" },
  { label: "支払時期", value: "クレジットカード：ご注文時\nコンビニ決済・銀行振込：ご注文後7日以内" },
  { label: "商品の引渡時期", value: "ご注文確認後、通常3〜7営業日以内に発送\n※受注生産品は商品ページに記載の日数" },
  { label: "返品・交換について", value: "商品到着後7日以内にご連絡ください。\n・お客様都合の返品：未開封・未使用に限り可（送料はお客様負担）\n・不良品・誤配送：送料当店負担で交換または返金" },
  { label: "返品送料", value: "お客様都合：お客様負担\n不良品・誤配送：当店負担" },
];

export default function LegalPage() {
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
            特定商取引法に基づく表記
          </Typography>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 4, md: 6 } }}>
        <Container maxWidth="md">
          <TableContainer sx={{ border: "1px solid #EAEAEA", borderRadius: 2 }}>
            <Table>
              <TableBody>
                {legalInfo.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        bgcolor: "#FAFAFA",
                        fontWeight: 600,
                        width: { xs: "35%", md: "25%" },
                        borderBottom: index < legalInfo.length - 1 ? "1px solid #EAEAEA" : "none",
                        verticalAlign: "top",
                        py: 2,
                        fontSize: "13px",
                        color: "#333",
                      }}
                    >
                      {item.label}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: index < legalInfo.length - 1 ? "1px solid #EAEAEA" : "none",
                        py: 2,
                        whiteSpace: "pre-line",
                        fontSize: "13px",
                        color: "#333",
                      }}
                    >
                      {item.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>
    </Box>
  );
}
