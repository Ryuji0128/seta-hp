import { Box, List, ListItem, Typography } from "@mui/material";
export default function DoctorIntroduction() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", lineHeight: 1.8 }}>
      {/* 本文 */}
      <Typography variant="body1" lineHeight={2.0}>
        瀬田製作所
は、地域の皆様に対して快適で、納得できる、安心な医療を提供することのできる<br></br>
        『気持ちの良いクリニック』であることを目指します。<br></br>
      </Typography>
      <List sx={{ listStyleType: "decimal", pl: 4 }}>
        <ListItem sx={{ display: "list-item" }}>
          正しい診断と治療への入口として、「人」を熟知し、地域に根ざしたホームドクターの使命を果たします。
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          提携する医療機関や医師と連携を図り、きめの細かい在宅医療を提供します。
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          患者さんの症状を緩和すると共に、科学的根拠に基づいた治療を行います。
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          患者さんの権利を尊重（医療の自己選択が出来る・十分な説明を受けられる・プライバシーの保護）し、
          患者さんのニーズにあった医療を提供します。
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          仲間とのコミュニケーションの充実、人間関係の構築を図り、働きがいのある職場にします。
        </ListItem>
      </List>
      {/* 代表取締役 */}
      <Box sx={{ mt: 4 }}>
        <Typography
          variant="subtitle1"
          fontWeight="regular"
          align="left"
          fontSize="30px"
          sx={{ fontFamily: 'Yuji Syuku' }}
        >
          院長: 木村 寛伸
        </Typography>
      </Box>
    </Box>
  );
}
