import { Resend } from "resend";
import { logger } from "@/lib/logger";

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] || c)
  );
}

interface SendContactEmailParams {
  name: string;
  email: string;
  message: string;
}

export async function sendContactEmail({
  name,
  email,
  message,
}: SendContactEmailParams) {
  const notificationEmail = process.env.NOTIFICATION_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;

  if (!notificationEmail) {
    logger.warn("NOTIFICATION_EMAIL not set, skipping email");
    return { success: true, skipped: true };
  }

  if (!apiKey || apiKey === "re_xxxxx") {
    logger.warn("RESEND_API_KEY not configured, skipping email");
    return { success: true, skipped: true };
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: "CV Contact Form <onboarding@resend.dev>",
      to: notificationEmail,
      replyTo: email,
      subject: `New contact from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}

Message:
${message}
      `.trim(),
    });

    if (error) {
      logger.error({ err: error }, "resend API error");
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    logger.error({ err }, "email send error");
    return { success: false, error: err };
  }
}
