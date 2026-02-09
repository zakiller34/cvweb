import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/ratelimit";
import { logger } from "@/lib/logger";

interface ContactForm {
  name: string;
  email: string;
  message: string;
  recaptchaToken?: string;
}

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;
const RECAPTCHA_THRESHOLD = 0.5;

async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!RECAPTCHA_SECRET) {
    // Skip reCAPTCHA when not configured
    return true;
  }

  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${RECAPTCHA_SECRET}&response=${token}`,
      }
    );
    const data = await response.json();
    return data.success && data.score >= RECAPTCHA_THRESHOLD;
  } catch (err) {
    logger.error({ err }, "reCAPTCHA verification failed");
    return false;
  }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 5000;
const MIN_MESSAGE_LENGTH = 10;

export async function POST(request: Request) {
  try {
    // Rate limit check
    const ip = getClientIp(request);
    const { success: rateLimitOk } = await checkRateLimit(`contact:${ip}`);
    if (!rateLimitOk) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { name, email, message, recaptchaToken } = body as ContactForm;

    // reCAPTCHA verification (skip if no token provided)
    if (recaptchaToken && !(await verifyRecaptcha(recaptchaToken))) {
      return NextResponse.json(
        { error: "Verification failed" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate types
    if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid field types" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate lengths
    if (name.trim().length === 0 || name.length > MAX_NAME_LENGTH) {
      return NextResponse.json(
        { error: `Name must be 1-${MAX_NAME_LENGTH} characters` },
        { status: 400 }
      );
    }

    if (message.trim().length < MIN_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message must be at least ${MIN_MESSAGE_LENGTH} characters` },
        { status: 400 }
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message must be under ${MAX_MESSAGE_LENGTH} characters` },
        { status: 413 }
      );
    }

    // Send email notification (non-blocking)
    sendContactEmail({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    }).catch((err) => {
      logger.error({ err }, "notification email failed");
    });

    return NextResponse.json(
      { success: true },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    logger.error({ err }, "POST /api/contact failed");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
