import nodemailer from "nodemailer";

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

const defaultFrom = `Invoiceser <${process.env.SMTP_USER || "noreply@invoiceser.app"}>`;

export async function sendEmail({
  to,
  subject,
  html,
  from,
  replyTo,
  attachments,
}: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  attachments?: { filename: string; content: Buffer }[];
}) {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: from || defaultFrom,
    to: Array.isArray(to) ? to.join(", ") : to,
    subject,
    html,
    replyTo,
    attachments,
  });
}
