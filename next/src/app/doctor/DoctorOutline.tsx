import { Box, Grid, Typography } from "@mui/material";

export default function CompanyInfoTable() {
  const companyData = [
    // { label: "医院名", value: "瀬田製作所
" },
    // { label: "院長", value: "木村 寛伸" },
    // { label: "設立年月日", value: "2023年8月" },
    // { label: "所在地", value: "〒521-0312 滋賀県米原市上野709" },
    { label: "専門分野", value: "消化器外科・胃腸科" },
  ];

  const businessOverview = `日本外科学会：専門医、指導医
        日本消化器外科学会：専門医、指導医
        日本消化器内視鏡学会：専門医、指導医
        日本消化器病学会：専門医
        検診マンモグラフィー読影認定医
        日本消化器外科学会：消化器がん外科治療認定医
        日本医師会認定産業医
  `;

  return (
    <Box sx={{ borderTop: "1px solid #ddd" }}>
      {/* 一般情報 */}
      {companyData.map((row, index) => (
        <Grid
          container
          key={index}
          sx={{
            py: 1.5,
            px: 2,
            borderBottom: index === companyData.length - 1 ? "none" : "1px solid #ddd",
          }}
        >
          <Grid item xs={3}>
            <Typography variant="body1">
              {row.label}
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography variant="body1">{row.value}</Typography>
          </Grid>
        </Grid>
      ))}

      {/* 事業概要 */}
      <Grid
        container
        sx={{
          py: 1.5,
          px: 2,
          borderBottom: "none",
        }}
      >
        <Grid item xs={3}>
          <Typography variant="body1">
            専門医・その他
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="body1" sx={{ whiteSpace: "pre-line", lineHeight: 1.8 }}>
            {businessOverview}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}