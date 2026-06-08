import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json().catch(() => ({}));

  if (!message?.trim()) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Email service not configured." }, { status: 500 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: ["rodriwuu@gmail.com"],
      subject: `Portfolio message from ${name?.trim() || "visitor"}`,
      text: [
        `Name:    ${name?.trim() || "anonymous"}`,
        `Email:   ${email?.trim() || "not provided"}`,
        ``,
        `Message:`,
        message.trim(),
      ].join("\n"),
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to send. Try again later." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
