import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LinkToContactPage from "@/components/LinkToContactPage";
import ReviewOverlay from "@/components/ReviewOverlay";
import { SimpleBarWrapper } from "@/components/SimpleBarWrapper";
import theme from "@/theme/theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Inter_Tight, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
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

const notoJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-jp",
  display: "swap",
});

const siteUrl = "https://setaseisakusyo.com";
const siteName = "SETA Craft";
const siteDescription =
  "MLBカード・トレカを美しく飾るための、富山県高岡市の小さな工房から。レーザー加工と3Dプリントで一つずつ手作りのアクリルディスプレイ。全国送料無料。";

export const metadata: Metadata = {
  title: {
    default: `${siteName} | カードは、飾るためにある。`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "MLBカード",
    "野球カード",
    "Topps",
    "大谷翔平",
    "トレカディスプレイ",
    "アクリルディスプレイ",
    "壁面ディスプレイ",
    "ハンドメイド",
    "富山",
    "高岡",
  ],

  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },

  icons: {
    icon: "/seta_logo.svg",
    apple: "/seta_logo.svg",
  },

  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: siteUrl,
    siteName: siteName,
    title: `${siteName} | カードは、飾るためにある。`,
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
    title: `${siteName} | カードは、飾るためにある。`,
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
  url: siteUrl,
  logo: `${siteUrl}/seta_logo.svg`,
  description: siteDescription,
  address: {
    "@type": "PostalAddress",
    addressCountry: "JP",
    addressLocality: "Takaoka",
    addressRegion: "Toyama",
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
            <SimpleBarWrapper>
              {/* ReviewOverlay は SimpleBar 内部スクロールに連動させるためここに置く。
                  position: relative を付けて、ピン (position: absolute) の基準にする */}
              <div style={{ position: "relative", minHeight: "100vh" }}>
                <Header />
                {children}
                <LinkToContactPage />
                <Footer />
                {process.env.NEXT_PUBLIC_ENABLE_COMMENTS === "true" && <ReviewOverlay />}
              </div>
            </SimpleBarWrapper>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
