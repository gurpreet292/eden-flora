import nodemailer from 'nodemailer'

const requiredEmailConfig = ['EMAIL_USER', 'EMAIL_PASSWORD', 'EMAIL_FROM']

const getEmailConfig = () => {
  const missing = requiredEmailConfig.filter((key) => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing email configuration: ${missing.join(', ')}`)
  }

  if (process.env.EMAIL_PASSWORD.includes('REPLACE_WITH_')) {
    throw new Error('EMAIL_PASSWORD must be a Gmail App Password for EMAIL_USER')
  }

  return {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD.replace(/\s+/g, ''),
    from: process.env.EMAIL_FROM,
  }
}

const createTransporter = () => {
  const { user, pass } = getEmailConfig()

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })
}

export const sendPasswordResetEmail = async ({ email, token }) => {
  const { from } = getEmailConfig()
  const transporter = createTransporter()
  const resetUrl = `${process.env.APP_URL || 'http://localhost:5173'}/reset-password?token=${encodeURIComponent(token)}`

  await transporter.sendMail({
    from,
    to: email,
    subject: 'Reset your Eden Flora password',
    text: `Reset your Eden Flora password here: ${resetUrl}. This link expires in one hour.`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1d3c2b; line-height: 1.6;">
        <h2>Reset your Eden Flora password</h2>
        <p>We received a request to reset your password.</p>
        <p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 20px; background: #1d3c2b; color: #fff; text-decoration: none; border-radius: 999px;">Reset password</a>
        </p>
        <p>This link expires in one hour. If you did not request this, you can ignore this email.</p>
      </div>
    `,
  })
}

export const sendContactEmail = async ({ name, email, topic, message }) => {
  const { from, user } = getEmailConfig()
  const transporter = createTransporter()

  await transporter.sendMail({
    from,
    to: user,
    replyTo: email,
    subject: `Eden Flora contact: ${topic}`,
    text: `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1d3c2b; line-height: 1.6;">
        <h2>New Eden Flora contact message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Topic:</strong> ${topic}</p>
        <p style="white-space: pre-line;">${message}</p>
      </div>
    `,
  })
}
