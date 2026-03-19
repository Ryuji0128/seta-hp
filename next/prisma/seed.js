const { PrismaClient } = require("@prisma/client");
const bcryptjs = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "管理者";

  if (!email || !password) {
    throw new Error(
      "環境変数 ADMIN_EMAIL と ADMIN_PASSWORD を設定してください。\n" +
      "例: ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=SecurePass123 npx prisma db seed"
    );
  }

  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD は8文字以上で設定してください。");
  }

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
