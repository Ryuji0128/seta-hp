import { Box, Container, Typography, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "会社情報 | SETA Craft",
  description: "瀬田製作所の会社情報。ものづくり・試作を行う会社です。",
  alternates: {
    canonical: "/company",
  },
};

const companyInfo = [
  { label: "会社名", value: "瀬田製作所" },
  { label: "所在地", value: "富山県高岡市" },
  { label: "設立", value: "2023年8月8日" },
  { label: "事業内容", value: "ものづくり・試作" },
  { label: "Email", value: "info@setaseisakusyo.com" },
];

export default function CompanyPage() {
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
            会社情報
          </Typography>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 4, md: 6 } }}>
        <Container maxWidth="md">
          <TableContainer sx={{ border: "1px solid #EAEAEA", borderRadius: 2 }}>
            <Table>
              <TableBody>
                {companyInfo.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        bgcolor: "#FAFAFA",
                        fontWeight: 600,
                        width: { xs: "35%", md: "25%" },
                        borderBottom: index < companyInfo.length - 1 ? "1px solid #EAEAEA" : "none",
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
                        borderBottom: index < companyInfo.length - 1 ? "1px solid #EAEAEA" : "none",
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
