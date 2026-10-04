import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({ host: env.SMTP_HOST, port: env.SMTP_PORT, secure: env.SMTP_SECURE, auth: { user: env.SMTP_USER, pass: env.SMTP_PASS } });

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char] ?? char));
}

export async function sendVerificationEmail(data: { email:string; name:string; url:string }) {
  const html = `<!doctype html><html><body style="margin:0;background:#070b14;color:#fff;font-family:Arial,sans-serif"><div style="max-width:680px;margin:30px auto;padding:34px;background:#0d1322;border:1px solid #1f2a42;border-radius:18px"><div style="font-size:28px;font-weight:800;letter-spacing:.08em">LUNARO<span style="color:#00c7ff">.</span></div><h1 style="font-size:28px">Verify your email</h1><p style="color:#9fb0ca">Hi ${escapeHtml(data.name)}, confirm your email address to activate your Lunaro account.</p><a href="${escapeHtml(data.url)}" style="display:inline-block;margin-top:12px;padding:14px 20px;border-radius:12px;background:#fff;color:#070b14;text-decoration:none;font-weight:700">Verify email</a><p style="margin-top:24px;color:#64748b;font-size:13px">This link expires in 30 minutes.</p></div></body></html>`;
  await transporter.sendMail({ from: env.CONTACT_FROM, to: data.email, subject: "Lunaro — Verify your email", html });
}

export async function sendContactNotification(data: { name:string; email:string; company?:string; phone?:string; service?:string; budget?:string; message:string }) {
  const rows = [
    ["Name", data.name], ["Email", data.email], ["Company", data.company ?? "—"], ["Phone", data.phone ?? "—"], ["Service", data.service ?? "—"], ["Budget", data.budget ?? "—"]
  ].map(([label,value]) => `<tr><td style="padding:10px;border-bottom:1px solid #243047;color:#8ea0bd">${label}</td><td style="padding:10px;border-bottom:1px solid #243047;color:#fff">${escapeHtml(value)}</td></tr>`).join("");
  const html = `<!doctype html><html><body style="margin:0;background:#070b14;color:#fff;font-family:Arial,sans-serif"><div style="max-width:680px;margin:30px auto;padding:30px;background:#0d1322;border:1px solid #1f2a42;border-radius:18px"><div style="font-size:28px;font-weight:800;letter-spacing:.08em">LUNARO</div><p style="color:#9fb0ca">New website inquiry</p><table style="width:100%;border-collapse:collapse">${rows}</table><h3 style="margin-top:28px">Message</h3><div style="padding:18px;background:#090e19;border-radius:12px;white-space:pre-wrap;color:#dfe8f5">${escapeHtml(data.message)}</div></div></body></html>`;
  await transporter.sendMail({ from: env.CONTACT_FROM, to: env.CONTACT_TO, replyTo: data.email, subject: `Lunaro — New inquiry from ${data.name}`, html });
}
