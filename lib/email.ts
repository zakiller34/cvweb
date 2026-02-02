import { Resend } from "resend";

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
    console.warn("NOTIFICATION_EMAIL not set, skipping email send");
    return { success: true, skipped: true };
  }

  if (!apiKey || apiKey === "re_xxxxx") {
    console.warn("RESEND_API_KEY not configured, skipping email send");
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
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
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
      console.error("Resend error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Email send error:", err);
    return { success: false, error: err };
  }
}
