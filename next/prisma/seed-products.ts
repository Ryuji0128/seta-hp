import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CORE_PRODUCTS = [
  {
    name: "アクリル壁面ディスプレイ 8枚モデル",
    description: `お気に入りのカード8枚を、壁一面にギャラリーのように展示できるアクリルディスプレイ。

標準スリーブ（トップローダー）のまま展示でき、カードに触れずにセット・取り外しが可能。UV対策素材を使用し、日焼けや黄ばみからカードを守ります。

レーザー加工で0.1mm精度のカットを施し、エッジは一つずつ手作業で面取り。壁面への取り付けは付属のピンで簡単に設置できます。

はじめてのカードディスプレイにおすすめの、コンパクトなエントリーモデルです。`,
    price: 8800,
    category: "card-display",
    tags: "壁面ディスプレイ,アクリル,8枚,MLBカード,トレカ,レーザー加工",
    stock: "受注生産",
  },
  {
    name: "アクリル壁面ディスプレイ 16枚モデル",
    description: `チーム単位やシリーズで集めたカード16枚を、統一感のあるレイアウトで展示できるアクリルディスプレイ。

4×4の均等配置で、コレクションに秩序と美しさを与えます。標準スリーブのまま展示可能、UV対策素材使用。

AWARD HISTORY（受賞歴）やシーズンベストなど、テーマを持ったコレクションの展示に最適。文字プレート（別売オプション）を組み合わせれば、まるでミュージアムのような展示空間が完成します。

飾Love で一番人気のスタンダードモデルです。`,
    price: 12800,
    category: "card-display",
    tags: "壁面ディスプレイ,アクリル,16枚,MLBカード,トレカ,レーザー加工,人気",
    stock: "受注生産",
  },
  {
    name: "アクリル壁面ディスプレイ 25枚モデル",
    description: `圧巻の25枚展示。壁一面をコレクションで埋め尽くす、飾Love のフラッグシップモデル。

5×5の配置で、選手のキャリアやチームの歴史をひと目で一望できます。大谷翔平選手の全受賞カードを時系列で並べたり、ドジャースの主力選手を一堂に集めたり。あなたのコレクションストーリーを壁に描けます。

標準スリーブ対応・UV対策素材・手作業の面取り仕上げ。すべてのこだわりは、8枚・16枚モデルと同じです。

文字プレート・年号プレート（別売オプション）との組み合わせで、世界にひとつだけの展示壁が完成します。`,
    price: 19800,
    category: "card-display",
    tags: "壁面ディスプレイ,アクリル,25枚,MLBカード,トレカ,レーザー加工,フラッグシップ",
    stock: "受注生産",
  },
];

async function main() {
  for (const product of CORE_PRODUCTS) {
    const existing = await prisma.product.findFirst({
      where: { name: product.name },
    });

    if (existing) {
      console.log(`スキップ（既存）: ${product.name}`);
      continue;
    }

    const created = await prisma.product.create({
      data: {
        ...product,
        isPublished: true,
        purchaseUrl: null,
      },
    });

    console.log(`作成: ${created.name} (ID: ${created.id}, ¥${created.price})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
