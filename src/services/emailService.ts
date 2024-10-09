import nodemailer from 'nodemailer'
import { resetPasswordEmailHtml } from '../utils/emailHtmlFormats.js';

type SendEmailProps = { 
    email: string, 
    token: string,
    uuid: string
}

export class EmailService {
    private transporter

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465, 
            secure: true, 
            auth: {
                user: process.env.EMAIL_SERVICE_LOGIN,
                pass: process.env.EMAIL_SERVICE_PASSWORD
            }
        })
    }
    
    async sendPasswordResetEmail({email, token, uuid}: SendEmailProps) {
        const verificationLink = `http://localhost:3000/api/user/password/reset/confirm/?trp=${token}&uuid=${uuid}`

        const mailOptions = {
            from: process.env.EMAIL_SERVICE_LOGIN, 
            to: [email],
            subject: 'Recuperar senha de usuário',
            html: resetPasswordEmailHtml.replace("{verificationLink}", verificationLink),
        }

        try{
            const info = await this.transporter.sendMail(mailOptions)
            console.log('Email sent:', info.accepted)
        } catch (error) {
            console.log('Email sent failed:', error)
        }
    }
}