import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

/**
 * robots.txt（/robots.txt）
 *
 * クロール不要な API のみをブロックし、サイトマップの場所を明示する。
 *
 * 注意: /login・/register・各 *-manage・/news など「検索結果に出したくない」ページは
 * ここでブロックしない。robots.txt でクロールを禁止すると Google がページ内の
 * meta robots(noindex) を読めず、URL だけがインデックスに残る恐れがあるため、
 * それらは「クロール可能なまま noindex を出す」方針とする（各ページ側で noindex 指定済み）。
 */
const DISALLOW = ["/api/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: DISALLOW,
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
