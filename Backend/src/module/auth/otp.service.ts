import crypto from "crypto"
import { config } from "../../config/config";
import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import { json } from "stream/consumers";
export const generateOTP = ()=>{
    const otp = crypto.randomInt(1000,9999);
    return otp;
};

export const hashOTP = (data:string)=>
{
    return crypto.createHmac('sha256',config.hashSecret as string).update(data).digest('hex');
};

export const verifyOTP = (hashedOTP:string,data:string)=>
{
    const newHashedOTP = hashOTP(data);
    return newHashedOTP === hashedOTP;
};

export const mailConfig = {
    service : 'gmail' as string,
    auth : {
        user : config.emailUsename as string,
        pass : config.emailPassword as string,
    }
}

const transporter = nodemailer.createTransport(mailConfig);

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "bookMyScreen",
    link: "https://amritraj.vercel.app",
    logo: "https://res.cloudinary.com/amritrajmaurya/image/upload/v1751475322/zu4fnmh2jljzbtey77ah.png",
  },
});

export const sendOTPtoEmail = async (email: string, otp: number) => {
  const emailTemp: any = {
    body: {
      name: "",
      intro: "Welcome to bookMyScreen! We're very excited to have you on board.",
      action: {
        instructions: "To verify your account, please use the following OTP:",
        button: {
          color: "#323232", 
          text: otp,
          link: "#",
        },
      },
      outro:
        "This OTP will expire in a short time (2 mins) for security reasons. If you did not request this, please ignore this email.",
    },
  };

  const mail = mailGenerator.generate(emailTemp);

  const mailOptions = {
    from: config.emailUsename,
    to: email,
    subject: "Your OTP for bookMyScreen",
    html: mail,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info.messageId;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send OTP email");
  }
};