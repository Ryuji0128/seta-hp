// siteUrlに環境変数を使うべきだが、本ファイルがjs指定で読み込まれるため、envConfigは使用不可。
// Google向け最適化: changefreqとpriorityはGoogleが無視するため削除

const locs = [
  "/",
  "/contact",
  "/news",
];

module.exports = {
  siteUrl: "https://setaseisakusyo.com", // サイトのベースURL
  generateRobotsTxt: true, // robots.txt を生成
  sitemapSize: 5000, // 1つのサイトマップに含めるURL数
  exclude: ["/portal-admin*", "/portal-login*"], // サイトマップから除外するパス
  additionalPaths: async () => [
    // サイトマップに含める追加のパス（動的ページとして認識され、自動捕捉されないため）
    ...locs.map(loc => ({ loc, lastmod: new Date().toISOString() })),
  ],
  transform: async (config, path) => ({
    loc: `${config.siteUrl}${path}`,
    lastmod: new Date().toISOString(),
  }),
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: ["/portal-admin", "/portal-login"],
      },
    ],
    additionalSitemaps: [
      "https://setaseisakusyo.com/sitemap.xml",
    ],
  },
};
