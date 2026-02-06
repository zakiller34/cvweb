export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { logger } = await import("@/lib/logger");
    logger.info({ nodeEnv: process.env.NODE_ENV }, "server starting");
  }
}
