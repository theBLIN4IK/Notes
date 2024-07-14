import 'dotenv/config'
import nodemailer from 'nodemailer'

class mailService {
	constructor() {
		this.transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: Number(process.env.SMTP_PORT),
			secure: false,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS
			}
		})
	}

	async sendActivationMail(email, link) {
		try {
			await this.transporter.sendMail({
				from: process.env.SMTP_USER,
				to: email,
				subject: `Активация аккаунта на ${process.env.CLIENT_URL}`,
				text: '',
				html:  `
				<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
				  <div style="background-color: white; padding: 30px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
					<h1 style="color: #333; margin-top: 0;">Активация аккаунта</h1>
					<p style="color: #666; line-height: 1.5;">Для активации аккаунта перейдите по ссылке ниже:</p>
					<a href="${link}" style="display: inline-block; background-color: #007bff; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin-top: 20px;">${link}</a>
				  </div>
				</div>
			  `
			})
		} catch (err) {
			console.error('Error sending email:', err)
			throw err
		}
	}
}

export default new mailService()
