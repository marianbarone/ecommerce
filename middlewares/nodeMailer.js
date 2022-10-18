import { createTransport } from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config()

export const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.TEST_MAIL,
        pass: process.env.TEST_MAIL_PASS
    }
});
