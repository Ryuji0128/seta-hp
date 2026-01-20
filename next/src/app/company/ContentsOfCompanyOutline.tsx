import { Box, Grid, Typography } from "@mui/material";

export default function CompanyInfoTable() {
  const companyData = [
    { label: "会社名", value: "瀬田製作所" },
    { label: "代表者", value: "木村 竜次" },
    { label: "設立年月日", value: "2023年8月" },
    { label: "所在地", value: "〒521-0312 滋賀県米原市上野709" },
    { label: "メンバー", value: "10名" },
  ];

  const businessOverview = `コンピュータシステムの企画、設計、開発、運用、保守、管理及び販売
    Webシステムの企画、設計、開発、運用、保守、管理及び販売
    IT（情報通信技術）全般に関するコンサルティング業務
    Webシステムを利用した研修用プログラムの開発
    ITプログラミング学習塾の経営
    ウィンタースポーツ等に関するシステムの開発、用品の開発レンタル
    スマートウォッチ等のウェアラブル（身体装着）端末の開発
    IoT機器（カメラ、センサ、スマートフォン、タブレット等の端末）の開発
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
            事業概要
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