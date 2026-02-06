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
import { logger } from "../lib/logger";

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD env vars required");
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
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

  logger.info("seed completed: admin user + default settings");
}

main()
  .catch((e) => {
    logger.error({ err: e }, "seed failed");
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
