import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";
const dbPath = dbUrl.replace("file:", "");
const absolutePath = path.isAbsolute(dbPath) ? dbPath : path.join(process.cwd(), dbPath);
const adapter = new PrismaBetterSqlite3({ url: absolutePath });
const prisma = new PrismaClient({ adapter });
import { logger } from "../lib/logger";

async function main() {
  // Read existing hideContactForm setting
  const oldSetting = await prisma.setting.findUnique({
    where: { key: "hideContactForm" },
  });

  if (oldSetting) {
    // Invert value: hideContactForm=true -> showContactForm=false
    const newValue = oldSetting.value === "true" ? "false" : "true";

    // Create new showContactForm setting
    await prisma.setting.upsert({
      where: { key: "showContactForm" },
      update: { value: newValue },
      create: { key: "showContactForm", value: newValue },
    });

    // Delete old hideContactForm setting
    await prisma.setting.delete({
      where: { key: "hideContactForm" },
    });

    logger.info(`migrated: hideContactForm=${oldSetting.value} -> showContactForm=${newValue}`);
  } else {
    logger.info("no hideContactForm setting found, nothing to migrate");
  }
}

main()
  .catch((e) => {
    logger.error({ err: e }, "migration failed");
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
