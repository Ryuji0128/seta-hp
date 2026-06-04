import { Box } from "@mui/material";
import type { Metadata } from "next";
import { getPrismaClient } from "@/lib/db";
import GalleryHero from "./_components/GalleryHero";
import GalleryGrid from "./_components/GalleryGrid";
import GalleryCta from "./_components/GalleryCta";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ギャラリー",
  description:
    "飾Love の制作事例ギャラリー。MLB・野球カードのアクリル壁面ディスプレイなど、実際の設置イメージをご覧いただけます。",
  alternates: {
    canonical: "/gallery",
  },
};

async function getWorks() {
  const prisma = getPrismaClient();
  return prisma.work.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });
}

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
