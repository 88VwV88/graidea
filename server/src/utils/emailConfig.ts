import nodemailer from "nodemailer";

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "ajaysaini2003@gmail.com",
    pass: "miqw ztcw nxsg ymmj",
  },
});

const sendEmail = async (email: string, subject: string, text: string): Promise<void> => {
    try {
        const info = await transporter.sendMail({
            from: '"Graidea" <ajaysaini2003@gmail.com>',
            to: email,
            subject: subject,
            text: `${text}`, // plain‑text body
            html: `${text}`, // HTML body
          });
          // console.log("Message sent:", info);
    } catch (error) {
        console.log(error);
    }
}   





export { sendEmail };