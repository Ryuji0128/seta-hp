import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LinkToContactPage from "@/components/LinkToContactPage";
import ReviewOverlay from "@/components/ReviewOverlay";
import theme from "@/theme/theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Inter_Tight, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

// 実際に使用しているウェイトのみ読み込む（転送量削減 #245）。
// 300 は未使用、800 は display フォント（Inter Tight）のみで使用。
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-inter-tight",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  variable: "--font-cormorant",
  display: "swap",
});

// 和文フォントは1ウェイトが最重量のため未使用の 300 を削除（転送量削減 #245）
const notoJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-jp",
  display: "swap",
});

const siteUrl = "https://kaza-love.com";
const siteName = "飾Love";
const siteDescription =
  "MLB・野球カードコレクターのためのアクリルディスプレイ工房。大谷翔平 AWARD HISTORY 風の壁面展示をはじめ、レーザー加工で一つ一つ丁寧に製作。全国送料無料、富山県高岡市から発送。";

export const metadata: Metadata = {
  title: {
    default: `${siteName} | MLBカード・トレカを美しく飾る`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "MLBカード",
    "野球カード",
    "大谷翔平",
    "Topps",
    "トレカディスプレイ",
    "アクリルディスプレイ",
    "壁面ディスプレイ",
    "カードコレクション",
    "AWARD HISTORY",
    "飾Love",
    "かざらぶ",
    "トレカ",
    "ドジャース",
    "ハンドメイド",
    "全国送料無料",
    "富山",
    "高岡",
  ],

  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },

  icons: {
    icon: "/kaza-love_favicon.png",
    apple: "/kaza-love_favicon.png",
  },

  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: siteUrl,
    siteName: siteName,
    title: `${siteName} | MLBカード・トレカを美しく飾る`,
    description: siteDescription,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `${siteName} | MLBカード・トレカを美しく飾る`,
    description: siteDescription,
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    // Google Search Console の確認コードをここに追加
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteName,
  alternateName: "かざらぶ",
  url: siteUrl,
  logo: `${siteUrl}/kaza-love_logo.png`,
  description: siteDescription,
  email: "info@kaza-love.com",
  sameAs: ["https://x.com/kaza_love_"],
  address: {
    "@type": "PostalAddress",
    addressCountry: "JP",
    addressRegion: "富山県",
    addressLocality: "高岡市",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${inter.variable} ${interTight.variable} ${cormorant.variable} ${notoJp.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* ネイティブスクロールを使用（simplebar-react は #245 で撤去、装飾は globals.css で対応）。
                position: relative は ReviewOverlay のピン (position: absolute) の基準 */}
            <div style={{ position: "relative", minHeight: "100vh" }}>
              <Header />
              {children}
              <LinkToContactPage />
              <Footer />
              {process.env.NEXT_PUBLIC_ENABLE_COMMENTS === "true" && <ReviewOverlay />}
            </div>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
