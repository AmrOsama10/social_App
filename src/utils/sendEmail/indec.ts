import nodemailer from "nodemailer";
import { SendEmailProps } from "./sendEmail.interface.js";
export const sendEmail = async ({ to, subject, html }: SendEmailProps) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  await transporter.sendMail({
    from: `social app <${process.env.EMAIL}>`,
    to,
    subject,
    html,
  });
};
