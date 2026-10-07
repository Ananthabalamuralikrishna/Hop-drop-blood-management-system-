import nodemailer from "nodemailer";
import { config } from "dotenv";

config();

/* CREATE TRANSPORTER */
let transporter;
let transporterReady;

const initializeTransporter = async () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log("📧 Email service initialized with real credentials.");
  } else {
    // Fallback to Ethereal Testing service
    console.log("⚠️ Real email credentials not found. Using Ethereal testing service.");
    let testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log("📧 Ethereal test account ready:", testAccount.user);
  }
};

// Store the initialization promise so we can await it
transporterReady = initializeTransporter();

/* SEND EMAIL FUNCTION */
export const sendEmail = async (to, subject, text) => {
  try {
    // Wait for transporter to be fully initialized
    await transporterReady;

    if (!transporter) {
      console.error("❌ Email transporter is not initialized.");
      return;
    }

    console.log("📧 Attempting to send email to:", to);

    const info = await transporter.sendMail({
      from: `"HOPE DROP Blood Bank" <${process.env.EMAIL_USER || 'hopedropbb@gmail.com'}>`,
      to,
      subject,
      text,
    });

    console.log("✅ Email sent successfully! Message ID:", info.messageId);

    // If using Ethereal, log the preview URL so the developer can see the email
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("👀 Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    // Do NOT throw — email failure shouldn't break the API
  }
};