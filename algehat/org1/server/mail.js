import nodemailer from 'nodemailer'

let user = process.env.EMAIL
let transport = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  auth: {
    user,
    pass: process.env.EMAIL_PASSWORD
  }
})

export default async function (options) {
  options.from = user
  return await transport.sendMail(options)
}
