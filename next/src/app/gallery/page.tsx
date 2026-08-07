import { Box } from "@mui/material";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { getPrismaClient } from "@/lib/db";
import { CACHE_REVALIDATE_SECONDS, CACHE_TAGS } from "@/lib/cache-tags";
import GalleryHero from "./_components/GalleryHero";
import GalleryGrid from "./_components/GalleryGrid";
import GalleryCta from "./_components/GalleryCta";

// CIビルド時はDBに到達できないため静的生成はせず、
// リクエスト毎レンダリング + unstable_cache（works タグ）でDBアクセスを抑える。
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ギャラリー",
  description:
    "飾Love の制作事例ギャラリー。MLB・野球カードのアクリル壁面ディスプレイなど、実際の設置イメージをご覧いただけます。",
  alternates: {
    canonical: "/gallery",
  },
};

// 公開制作事例の全件取得。制作事例の書き込み時に works タグで無効化される。
const getWorks = unstable_cache(
  async () => {
    const prisma = getPrismaClient();
    return prisma.work.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });
  },
  ["published-works"],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: [CACHE_TAGS.works] }
);

export default async function GalleryPage() {
  const works = await getWorks();

  return (
    <Box sx={{ bgcolor: "#FFFFFF" }}>
      <GalleryHero count={works.length} />
      <GalleryGrid works={works} />
      <GalleryCta />
    </Box>
  );
}
