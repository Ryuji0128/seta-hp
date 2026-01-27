import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LinkToContactPage from "@/components/LinkToContactPage";
import { SimpleBarWrapper } from "@/components/SimpleBarWrapper";
import theme from "@/theme/theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://setaseisakusyo.com";
const siteName = "瀬田製作所";
const siteDescription =
  "瀬田製作所は、Webアプリケーションやモバイルアプリの開発を中心に、多様なプロジェクトで信頼を得ているエンジニアチームです。先進技術を用いた、最適なソリューションを提供します。";

export const metadata: Metadata = {
  // 基本情報
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,

  // canonical URL
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },

  // アイコン
  icons: {
    icon: "/seta_logo.svg",
    apple: "/seta_logo.svg",
  },

  // OGP (Open Graph Protocol)
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: siteUrl,
    siteName: siteName,
    title: siteName,
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

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: ["/og-image.png"],
  },

  // robots
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

  // 検証用（Google Search Console）
  verification: {
    // Google Search Console の確認コードをここに追加
    // google: "your-google-verification-code",
  },
};

// 構造化データ (JSON-LD)
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
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
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
              <Header />
              {children}
              <LinkToContactPage />
              <Footer />
            </SimpleBarWrapper>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}