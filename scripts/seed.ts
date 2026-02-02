import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";
const dbPath = dbUrl.replace("file:", "");
const absolutePath = path.isAbsolute(dbPath) ? dbPath : path.join(process.cwd(), dbPath);
const adapter = new PrismaBetterSqlite3({ url: absolutePath });
const prisma = new PrismaClient({ adapter });
import bcrypt from "bcryptjs";

async function main() {
  // Create default admin user
  const hashedPassword = await bcrypt.hash("changeme123", 10);

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: hashedPassword,
    },
  });

  // Create default settings
  await prisma.setting.upsert({
    where: { key: "showCvDownload" },
    update: {},
    create: {
      key: "showCvDownload",
      value: "true",
    },
  });

  console.log("Seed completed: admin user + default settings");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
