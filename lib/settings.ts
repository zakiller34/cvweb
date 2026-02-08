import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

const SETTING_KEYS = [
  "showCvDownload",
  "showContactForm",
  "showMailToSidebar",
  "showPortfolio",
  "showScheduleMeeting",
] as const;

export type SettingKey = (typeof SETTING_KEYS)[number];

/** camelCase → SCREAMING_SNAKE: showCvDownload → SHOW_CV_DOWNLOAD */
function toEnvKey(key: string): string {
  return key.replace(/([A-Z])/g, "_$1").toUpperCase();
}

function getEnvDefault(key: SettingKey): boolean {
  const envVal = process.env[toEnvKey(key)];
  if (envVal === undefined) return false;
  return envVal === "true";
}

export async function getSettingWithFallback(key: SettingKey): Promise<boolean> {
  try {
    const setting = await prisma.setting.findUnique({ where: { key } });
    if (setting) return setting.value !== "false";
    return getEnvDefault(key);
  } catch (err) {
    logger.warn({ err, key }, "DB unavailable, using env default for setting");
    return getEnvDefault(key);
  }
}

export async function getAllSettings(): Promise<Record<SettingKey, boolean>> {
  const entries = await Promise.all(
    SETTING_KEYS.map(async (key) => [key, await getSettingWithFallback(key)] as const)
  );
  return Object.fromEntries(entries) as Record<SettingKey, boolean>;
}

export { SETTING_KEYS };
