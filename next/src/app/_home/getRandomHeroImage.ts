import { getPrismaClient } from "@/lib/db";

export async function getRandomHeroImage(): Promise<string | null> {
  const prisma = getPrismaClient();
  const heroProducts = await prisma.product.findMany({
    where: { isHeroImage: true, isPublished: true, image: { not: null } },
    select: { image: true },
  });

  if (heroProducts.length === 0) return null;

  const idx = Math.floor(Math.random() * heroProducts.length);
  return heroProducts[idx].image;
}
