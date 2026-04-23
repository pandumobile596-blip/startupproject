import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  const { name, email, message } = await request.json();

  if (!message || message.trim().length === 0) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const { GMAIL_USER, GMAIL_APP_PASSWORD, FEEDBACK_TO_EMAIL } = process.env;

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !FEEDBACK_TO_EMAIL) {
    console.error("Email env vars not set.");
    return NextResponse.json({ error: "Email service not configured." }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });

  const senderLine = name || email
    ? `From: ${name || "Anonymous"}${email ? ` <${email}>` : ""}`
    : "From: Anonymous";

  await transporter.sendMail({
    from: `"Landlord Ledger Feedback" <${GMAIL_USER}>`,
    to: FEEDBACK_TO_EMAIL,
    replyTo: email || GMAIL_USER,
    subject: `New Feedback — Landlord Ledger`,
    text: `${senderLine}\n\n${message}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="margin:0 0 16px;font-size:18px;color:#111827;">New Feedback</h2>
        <table style="width:100%;font-size:14px;color:#374151;margin-bottom:20px;">
          <tr><td style="padding:4px 0;color:#6b7280;width:80px;">Name</td><td>${name || "—"}</td></tr>
          <tr><td style="padding:4px 0;color:#6b7280;">Email</td><td>${email || "—"}</td></tr>
        </table>
        <div style="background:#f9fafb;border-radius:8px;padding:16px;font-size:14px;color:#111827;white-space:pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
        <p style="margin:20px 0 0;font-size:12px;color:#9ca3af;">Sent from Landlord Ledger · ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })}</p>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
}
