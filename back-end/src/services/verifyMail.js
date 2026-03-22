import nodemailer from "nodemailer";
import dotenv from "dotenv";
import handlebars from "handlebars";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error("Missing EMAIL_USER or EMAIL_PASS in .env");
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const verifyMail = async (mail, otp) => {
  try {
    const source = await fs.promises.readFile(
      path.join(__dirname, "verifyTemplete.hbs"),
      "utf-8",
    );

    const template = handlebars.compile(source);

    const htmlToSend = template({
      otp: otp,
      year: new Date().getFullYear(),
      appName: "HunarHub",
    });

    const info = await transporter.sendMail({
      from: `"HunarHub" <${process.env.EMAIL_USER}>`,
      to: mail,
      subject: "Your Verification Code",
      text: `Your HunarHub verification code is: ${otp}. This code expires in 10 minutes.`,
      html: htmlToSend,
    });

    return info;
  } catch (err) {
    console.error("Email error:", err);
    throw err;
  }
};

export default verifyMail;
