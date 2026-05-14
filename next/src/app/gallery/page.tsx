import { Box, Container } from "@mui/material";
import type { Metadata } from "next";
import { getPrismaClient } from "@/lib/db";
import GalleryHero from "./_components/GalleryHero";
import GalleryGrid from "./_components/GalleryGrid";
import GalleryCta from "./_components/GalleryCta";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ギャラリー | 飾Love",
  description:
    "飾Love の制作事例。MLBカードコレクター向けのアクリルディスプレイ・特注品など、これまでに制作した作品をご覧いただけます。",
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
