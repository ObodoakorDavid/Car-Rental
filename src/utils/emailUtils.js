import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs"; // Import the file system module
import { dirname, join } from "path";
import { fileURLToPath } from "url";

//
import OTP from "../models/otp.js";
import generateOTP from "../utils/generateOTP.js";
import { formatDate } from "./dateUtils.js";

import env from "dotenv";
env.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const templatePath = join(__dirname, "..", "templates", "OTPTemplate.html");

// Read the HTML template file
const emailTemplateSource = fs.readFileSync(templatePath, "utf8");

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: process.env.BREVO_EMAIL,
        pass: process.env.BREVO_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: "Admin@Pausepoint.com",
      to: to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// Function to send OTP by email
const sendOTPByEmail = async (email, userName) => {
  // Delete any existing otp with the user email
  await OTP.findOneAndDelete({ email });

  // Generate new OTP
  const otp = generateOTP();

  //Add new OTP To DB
  await OTP.create({ email, otp });

  // Create Email Details
  const subject = "OTP Request";
  const date = formatDate(Date.now());
  const emailText = `Hello ${userName},\n\nYour OTP is: ${otp}`;

  // Compile Handlebars template
  const template = handlebars.compile(emailTemplateSource);

  // Render the template with data
  const html = template({ userName, otp, date });

  return sendEmail({
    to: email,
    subject,
    text: emailText,
    html,
  });
};

// import twilio from "twilio";

// const client = twilio(
//   process.env.TWILIO_ACCOUNTSID,
//   process.env.TWILIO_AUTHTOKEN
// );

// // Function to send OTP by SMS
// const sendOTPBySMS = async (email, userName) => {
//   // Delete any existing otp with the user email
//   await OTP.findOneAndDelete({ email });

//   // Generate new OTP
//   const otp = generateOTP();

//   //Add new OTP To DB
//   await OTP.create({ email, otp });

//   const message = await client.messages.create({
//     body: `Your OTP IS ${otp}. Testing Whatsapp OTP`,
//     from: "whatsapp:+14155238886",
//     to: "whatsapp:+2348182921822",
//   });

//   console.log(message.sid);
//   return message;
// };

export default { sendEmail, sendOTPByEmail };
