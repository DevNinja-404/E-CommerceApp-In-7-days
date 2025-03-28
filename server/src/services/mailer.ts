import nodemailer from "nodemailer";
import { asyncHandler } from "../utils/asyncHandler.js";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST as string,
  port: parseInt(process.env.SMTP_PORT as string),
  auth: {
    user: process.env.SMTP_USER as string,
    pass: process.env.SMTP_PASS as string,
  },
});

export const mailer = async (email: string, subject: string, body: string) => {
  const info = await transporter.sendMail({
    from: "ShopUp <sahb2676@gmail.com>",
    to: email,
    subject,
    html: `<b>${body}</b>`,
    replyTo: "sahb2676@gmail.com",
  });

  return info.messageId;
};
