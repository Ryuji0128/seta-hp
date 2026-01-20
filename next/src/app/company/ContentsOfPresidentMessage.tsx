import { Box, Typography } from "@mui/material";

export default function DoctorIntroduction() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", lineHeight: 1.8 }}>
      {/* 本文 */}
      <Typography variant="body1" lineHeight={2.0}>
        瀬田製作所は、Webアプリケーション開発やiOS・Androidアプリ開発を中心に、幅広い地域のお客様から信頼を得ているエンジニアチームです。<br></br>
        私たちは、地域や国境にとらわれることなく、多様なプロジェクトに取り組んでおり、Webシステム開発やホームページ制作をはじめ、ニアショア体制を活用したラボ型開発にも積極的に対応しています。
        自社での開発を重視することで、チーム内でのコミュニケーションを活性化し、若手の育成環境を整備しています。その結果、未経験者の採用も積極的に行い、次世代のエンジニア育成にも力を注いでいます。<br></br>
        さらに、現在の事業領域にとどまらず、新たな挑戦にも意欲的に取り組んでいます。そのためには社員同士がアイディアを自由に出し合える環境が不可欠です。このように生まれた発想を活かし、より価値のあるサービスをお客様に提供することを目指しています。<br></br>
        瀬田製作所は、固定された枠に縛られることなく、新しい技術やアイディアを活かして、社会に貢献できる企業であり続けることを目指しています。これからも多様なプロジェクトを通じてさらなる成長を続けていきます。
      </Typography>

      {/* 代表取締役 */}
      <Box sx={{ mt: 4 }}>
        <Typography
          variant="subtitle1"
          fontWeight="regular"
          align="left"
          fontSize="30px"
          sx={{ fontFamily: 'Yuji Syuku' }}
        >
          代表取締役　木村 竜次
        </Typography>
      </Box>
    </Box>
  );
}
