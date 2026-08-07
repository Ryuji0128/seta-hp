import { unstable_cache } from "next/cache";
import { getPrismaClient } from "@/lib/db";
import { normalizeImageUrl } from "@/lib/images";
import { CACHE_REVALIDATE_SECONDS, CACHE_TAGS } from "@/lib/cache-tags";

// ヒーロー候補の取得はキャッシュし（products タグで管理画面の更新時に無効化）、
// ランダム抽選だけをリクエスト毎に行う。DBアクセスはキャッシュ切れ時のみ。
const getHeroImageCandidates = unstable_cache(
  async (): Promise<string[]> => {
    const prisma = getPrismaClient();
    const heroProducts = await prisma.product.findMany({
      where: { isHeroImage: true, isPublished: true, image: { not: null } },
      select: { image: true },
    });
    return heroProducts
      .map((p) => normalizeImageUrl(p.image))
      .filter((img): img is string => Boolean(img));
  },
  ["hero-image-candidates"],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: [CACHE_TAGS.products] }
);

export async function getRandomHeroImage(): Promise<string | null> {
  try {
    const candidates = await getHeroImageCandidates();
    if (candidates.length === 0) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
  } catch (error) {
    // DB障害時もトップページ自体は落とさない（ロゴ画像にフォールバック）
    console.error("ヒーロー画像の取得に失敗:", error);
    return null;
  }
}
