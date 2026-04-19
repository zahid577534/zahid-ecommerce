import nodemailer from "nodemailer"

if (
  !process.env.NODEMAILER_HOST ||
  !process.env.NODEMAILER_PORT ||
  !process.env.NODEMAILER_EMAIL ||
  !process.env.NODEMAILER_PASSWORD
) {
  throw new Error("Missing Nodemailer environment variables")
}

const port = Number(process.env.NODEMAILER_PORT)

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: port,
  secure: port === 465, // automatically handle secure
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
})

const sendMail = async (options) => {
  try {
    const info = await transporter.sendMail({
      from: `"Ecommerce App" <${process.env.NODEMAILER_EMAIL}>`,
      ...options,
    })

    return { success: true, info }
  } catch (error) {
    console.error("Mail error:", error)
    return { success: false, error: error.message }
  }
}

export default sendMail