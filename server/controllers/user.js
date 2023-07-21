const User = require('../models/user');
const asynHandler = require('express-async-handler');
const {
	generateAccessToken,
	generateRefreshToken,
} = require('../middlewares/jwt.js');
const jwt = require('jsonwebtoken');
const sendMailer = require('../utils/sendMailer');
const crypto = require('crypto');

const register = asynHandler(async (req, res) => {
	const { email, password, firstname, lastname } = req.body;
	if (!email || !password || !lastname || !firstname)
		return res.status(400).json({
			success: false,
			mes: 'Missing inputs',
		});
	const user = await User.findOne({ email });
	if (user) throw new Error('User has existed');
	else {
		const newUser = await User.create(req.body);
		return res.status(200).json({
			success: newUser ? true : false,
			mes: newUser
				? 'Register is successfully. Please go login~ '
				: 'Something went wrong',
		});
	}
});
// Refresh token => Cap moi access token
// Access token => Xac thuc nguoi dung, phan quyen nguoi dung
const login = asynHandler(async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password)
		return res.status(400).json({
			success: false,
			mes: 'Missing inputs',
		});
	const response = await User.findOne({ email });
	if (response && (await response.isCorrectPassword(password))) {
		// Tach pass va role ra khoi response
		const { password, role, ...userData } = response.toObject();
		// Tao access token
		const accessToken = generateAccessToken(response._id, role);
		// Tao refresh token
		const refreshToken = generateRefreshToken(response._id);
		// Luu refresh token vao database
		await User.findByIdAndUpdate(response._id, { refreshToken }, { new: true });
		// Luu refresh token vao cookie
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});
		return res.status(200).json({
			success: true,
			accessToken,
			userData,
		});
	} else {
		throw new Error('Invalid credentials!');
	}
});

const getCurrent = asynHandler(async (req, res) => {
	const { _id } = req.user;

	const user = await User.findById(_id).select('-refreshToken -password -role');
	return res.status(200).json({
		success: false,
		rs: user ? user : 'User not found',
	});
});
const refreshAccessToken = asynHandler(async (req, res) => {
	// Lay token tu cookie
	const cookie = req.cookies;
	// Check xem co token hay khong
	if (!cookie && !cookie.refreshToken)
		throw new Error('No refresh token in cookie');
	// Check token co hop le hay khong
	const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
	const response = await User.findOne({
		_id: rs._id,
		refreshToken: cookie.refreshToken,
	});
	return res.status(200).json({
		success: response ? true : false,
		newAccessToken: response
			? generateAccessToken(response._id, response.role)
			: 'Refresh token not matched',
	});
});
const logout = asynHandler(async (req, res) => {
	const cookie = req.cookies;
	if (!cookie || !cookie.refreshToken)
		throw new Error('No refresh token in cookie');
	// Xoa refresh token trong db
	await User.findOneAndUpdate(
		{ refreshToken: cookie.refreshToken },
		{ refreshToken: '' },
		{ new: true },
	);
	// Xoa refresh token trong cookie
	res.clearCookie('refreshToken', {
		httpOnly: true,
		secure: true,
	});
	return res.status(200).json({
		success: true,
		mes: 'Logout successfully',
	});
});
/* 
Client gui email
Server check email co hop le hay khong=>Gui mail+kem theo link (password change token)
Client check mail=>Click link
Client gui api kem token
Check token co giong voi token ma server gui mail hay khong 
Change password
*/

const forgotPassword = asynHandler(async (req, res) => {
	const { email } = req.query;
	if (!email) throw new Error('Missing email');
	const user = await User.findOne({ email });
	if (!user) throw new Error('User not found');
	const resetToken = user.createPasswordChangedToken();
	await user.save();
	const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}>Click here</a>`;
	const data = {
		email,
		html,
	};
	const rs = await sendMailer(data);
	return res.status(200).json({
		success: true,
		rs,
	});
});
const resetPassword = asynHandler(async (req, res) => {
	const { password, token } = req.body;
	if (!password || !token) throw new Error('Missing inputs');
	const passwordResetToken = crypto
		.createHash('sha256')
		.update(token)
		.digest('hex');
	const user = await User.findOne({
		passwordResetToken,
		passwordResetExpire: { $gt: Date.now() },
	});
	if (!user) throw new Error('Invalid reset token');
	user.password = password;
	user.passwordResetToken = undefined;
	user.passwordChangedAt = Date.now();
	user.passwordResetExpire = undefined;
	await user.save();
	return res.status(200).json({
		success: user ? true : false,
		mes: user ? 'Reset password successfully' : 'Something went wrong',
	});
});
module.exports = {
	register,
	login,
	getCurrent,
	refreshAccessToken,
	logout,
	forgotPassword,
	resetPassword,
};
