import { NextResponse } from "next/server";

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export async function POST(request: Request) {
  try {
    const body: ContactForm = await request.json();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // TODO: Implement actual email sending or database storage
    // For now, just log and return success
    console.log("Contact form submission:", body);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
