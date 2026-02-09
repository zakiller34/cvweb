const SETTING_KEYS = [
  "showCvDownload",
  "showContactForm",
  "showMailToSidebar",
  "showPortfolio",
  "showScheduleMeeting",
  "showGitHub",
  "showLinkedIn",
] as const;

export type SettingKey = (typeof SETTING_KEYS)[number];

/** camelCase → SCREAMING_SNAKE: showCvDownload → SHOW_CV_DOWNLOAD */
function toEnvKey(key: string): string {
  return key.replace(/([A-Z])/g, "_$1").toUpperCase();
}

function getEnvSetting(key: SettingKey): boolean {
  return process.env[toEnvKey(key)] === "true";
}

export function getAllSettings(): Record<SettingKey, boolean> {
  const entries = SETTING_KEYS.map((key) => [key, getEnvSetting(key)] as const);
  return Object.fromEntries(entries) as Record<SettingKey, boolean>;
}

export { SETTING_KEYS };
