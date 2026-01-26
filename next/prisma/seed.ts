import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@admin.com";
  const password = process.env.ADMIN_PASSWORD || "admin3205";
  const name = process.env.ADMIN_NAME || "管理者";

  const hashedPassword = await bcryptjs.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: "ADMIN",
      name,
    },
    create: {
      email,
      password: hashedPassword,
      role: "ADMIN",
      name,
    },
  });

  console.log(`管理者アカウントを作成しました: ${user.email} (ID: ${user.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
