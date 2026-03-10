// providers/Mail/NodeMailerService.ts
import nodemailer from "nodemailer"

interface MailOptions {
  to: string
  subject: string
  text?: string
  html?: string
}

export class NodeMailerService {
  private transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true", 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }

  async sendMail({ to, subject, text, html }: MailOptions) {
    try {
      const info = await this.transporter.sendMail({
        from: `"NoReply" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
        html,
      })

      console.log(`Email sent to ${to}: ${info.messageId}`)
      return info
    } catch (err: any) {
      console.error(`Failed to send email to ${to}: ${err.message}`)
      throw new Error("Email could not be sent")
    }
  }

  // Méthode spécifique pour OTP
  async sendOtp(to: string, otp: string) {
    const subject = "Votre code OTP"
    const html = `<p>Votre code OTP est : <strong>${otp}</strong>. Il expire dans 5 minutes.</p>`
    return this.sendMail({ to, subject, html })
  }

  // Méthode spécifique pour reset password
  async sendResetPassword(to: string, token: string) {
    const subject = "Réinitialisation du mot de passe"
    const html = `<p>Pour réinitialiser votre mot de passe, cliquez sur ce lien : 
      <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}">Réinitialiser</a></p>`
    return this.sendMail({ to, subject, html })
  }
}
