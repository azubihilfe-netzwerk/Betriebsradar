import type {Transporter}  from "nodemailer";
import nodemailer from "nodemailer";
require("dotenv").config();


let _transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host:  process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS }

    });
  }
  return _transporter;
}

export function setTransporter(t: Transporter): void {
  _transporter = t;
}

getTransporter().verify();

export async function sendVerificationEmail(email: string, accessKey: string, name: string): Promise<void> {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const verificationUrl = `${frontendUrl}/verify-email?token=${accessKey}`;

  await getTransporter().sendMail({
    from: process.env.SMTP_FROM || 'donotreply@betriebsradar.org',
    to: email,
    subject: 'Bitte bestätige deine E-Mail-Adresse – Betriebsradar',
    text: `Vielen Dank für deinen Erfahrungsbericht!\n\nBitte bestätige deine E-Mail-Adresse:\n${verificationUrl}`,
    html: `<p>Hallo ${name},</p>
           <p>Vielen Dank für deinen Erfahrungsbericht!</p>
           <p>Bitte klicke auf den folgenden Link, um deine E-Mail-Adresse zu bestätigen:</p>
           <a href="${verificationUrl}">${verificationUrl}</a>
           <p>Dies ist eine automatisch erzeugt Mail. Bitte antworte nicht direkt daruf. Wenn du uns kontaktieren möchtest, schreib uns
           <a href="mailto:kontakt@betriebsradar.org">kontakt@betriebsradar.org</a>.</p>`,
  });
}
