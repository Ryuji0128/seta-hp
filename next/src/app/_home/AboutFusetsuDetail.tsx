import BaseContainer from "@/components/BaseContainer";
import { Box, Divider, Typography } from "@mui/material";
import { motion } from "framer-motion";

const AboutFusetsuDetail = () => {
  const imageWidth = 30;
  const contentWidth = 100 - imageWidth;
  return (
    <BaseContainer>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // モバイルとタブレットは縦並び、PC以上は横並び
          gap: 5, // 子要素間のスペース
          justifyContent: { xs: "center", md: "flex-start" }, // モバイルとタブレット: 中央揃え, PC以上: 左揃え
          alignItems: { xs: "center", md: "center" }, // モバイルとタブレット: 中央揃え, PC以上: 上揃え
          textAlign: "left", // テキストは常に左揃え
          marginBottom: 10, // 下の余白
        }}
      >
        {/* 左側コンポーネント */}
        <Box
          sx={{
            width: { xs: "100%", md: `${imageWidth}%` },
            padding: { xs: 0, md: 5 }, // モバイルとタブレットはパディングなし、PC以上はパディング5
            display: { xs: "none", md: "flex" }, // モバイルとタブレットは非表示
          }}
        >
          {/* <Image
            src="/arrow_vector_image.svg"
            alt="瀬田製作所ロゴ"
            width={100} // 任意のダミー値
            height={100} // 任意のダミー値
            style={{ width: "100%", height: "auto" }} // パーセントの設定、画像の幅と高さをレスポンシブに調整
            sizes="100vw"
          /> */}
        </Box>

        {/* 右側コンポーネント（枠線とアニメーション） */}
        <Box sx={{ width: { xs: "100%", md: `${contentWidth}%` } }}>
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            sx={{
              display: "flex",
              direction: "column",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              py: 7,
              borderRadius: "10px",
              // backgroundColor: "primary.pale",
              // boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.3)",
              overflow: "hidden",
              "&::before, &::after": {
                content: '""',
                position: "absolute",
                width: "20%",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "primary.light",
                animation: "slide 4s infinite alternate",
              },
              "&::before": { top: 0, left: 50 },
              "&::after": { bottom: 0, right: 50 },
              "@keyframes slide": {
                "0%": { transform: "translateX(-30px)" },
                "100%": { transform: "translateX(30px)" },
              },
            }}
          >
            <Typography
              sx={{
                fontSize: "1.2rem",
                fontWeight: "medium",
                textAlign: "center",
              }}
            >
              好奇心が、次のモノを生み出す。
            </Typography>
          </Box>
          {/* 説明文 */}
          <Box
            sx={{ paddingTop: "4rem", lineHeight: 1.8, fontSize: "0.95rem" }}
          >
            <p>瀬田製作所は、社長をはじめ“作りたい気持ち”を大切にしています。</p>
            <p>「これが面白い」「これがあったら嬉しい」——そんな想いから生まれた製品が、</p>
            <p>結果的に多くの人に喜んでもらえる。</p>
            <p>私たちは、そんな自由で楽しいものづくりを続けています。</p>
          </Box>

          {/* リンクボタン */}
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Box
              component="a"
              href="/company"
              sx={{
                display: "inline-block",
                border: "2px solid",
                borderRadius: "5px",
                padding: "10px 20px",
                fontWeight: "bold",
                textDecoration: "none",
                color: "info.main",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: "info.pale",
                  color: "info.main",
                },
              }}
            >
              会社案内はこちら
            </Box>
          </Box>
        </Box>
      </Box>

      {/* 導入事例セクション前の区切り線 */}
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <Divider
          sx={{
            width: "70%", // 横幅70%
            borderColor: "info.light", // 薄い色の区切り線
            borderBottomWidth: "1px",
          }}
        />
      </Box>

    </BaseContainer>
  );
};

export default AboutFusetsuDetail;
