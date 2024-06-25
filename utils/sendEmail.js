import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendEmail = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.FROM_EMAIL,
        pass: process.env.FROM_EMAIL_2FA,
      },
    });

    const options = {
      from: `"Tu aplicación 👻" <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: subject,
      html: html,
    };

    await transporter.sendMail(options);
    return { success: true };
  } catch (error) {
    console.error("Error enviando correo:", error);
    return { success: false, error: error.message };
  }
};

export default sendEmail;

