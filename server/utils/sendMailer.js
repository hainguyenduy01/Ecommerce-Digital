const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');
const sendMailer = asyncHandler(async ({ email, html }) => {
	let transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 587,
		secure: false,
		auth: {
			user: process.env.EMAIL_NAME,
			pass: process.env.EMAIL_APP_PASSWORD,
		},
	});
	// send mail with defined transport object
	let info = await transporter.sendMail({
		from: '"DigitalEcommerce" <nguyenduyhai308@gmail.com>', // sender address
		to: email, // list of receivers
		subject: 'Quên mật khẩu', // Subject line
		html: html, // html body
	});
	return info;
});
module.exports = sendMailer;
