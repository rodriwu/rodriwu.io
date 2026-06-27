import { NextRequest, NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const name = String(body?.name ?? "").trim().slice(0, 120);
  const email = String(body?.email ?? "").trim().slice(0, 200);
  const message = String(body?.message ?? "").trim().slice(0, 5000);
  const honeypot = String(body?.company ?? "").trim();

  if (honeypot) return NextResponse.json({ ok: true });
  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }
  if (email && !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Email service not configured." }, { status: 500 });
  }

  const fromAddress = process.env.RESEND_FROM || "Portfolio Contact <onboarding@resend.dev>";
  const toAddress = process.env.CONTACT_TO || "rodriwuu@gmail.com";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromAddress,
      to: [toAddress],
      ...(email ? { reply_to: email } : {}),
      subject: `Portfolio: ${name || email || "anonymous visitor"}`,
      text: [
        `Name:    ${name || "anonymous"}`,
        `Email:   ${email || "not provided"}`,
        ``,
        `Message:`,
        message,
      ].join("\n"),
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to send. Try again later." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
