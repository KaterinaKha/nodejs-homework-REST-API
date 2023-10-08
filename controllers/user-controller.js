import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import { nanoid } from "nanoid";

import User from "../models/User.js";

import { HttpError, sendEmail } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const { JWT_SECRET, BASE_URL, PORT } = process.env;
const avatarPath = path.resolve("public", "avatars");

const register = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (user) {
		throw HttpError(409, "Email in use");
	}

	const hashPassword = await bcrypt.hash(password, 10);

	const avatarURL = gravatar.url(email);
	const verificationToken = nanoid();

	const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken });

	const verifyEmail = {
		to: email,
		subject: "Verify email",
		html: `<a target = "_blank" href = "${BASE_URL}:${PORT}/api/users/verify/${verificationToken}">Click to verify email</a>`,
	};

	await sendEmail(verifyEmail);

	res.status(201).json({
		username: newUser.username,
		email: newUser.email,
	});
};

const verify = async (req, res) => {
	const { verificationToken } = req.params;
	const user = await User.findOne({ verificationToken });

	if (!user) {
		// throw HttpError(404);
		return res.status(404).json({
			message: "User not found",
		});
	}

	await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });

	res.status(200).json({
		message: "Verification successful",
	});
};

const resendVerifyEmail = async (req, res) => {
	const { email } = req.body;
	const user = await User.findOne({ email });

	if (!user) {
		return res.status(404).json({
			message: "Email not found",
		});
	}

	if (user.verify) {
		return res.status(400).json({
			message: "Verification has already been passed",
		});
	}

	const verifyEmail = {
		to: email,
		subject: "Verify email",
		html: `<a target = "_blank" href = "${BASE_URL}:${PORT}/api/users/verify/${user.verificationToken}">Click to verify email</a>`,
	};

	await sendEmail(verifyEmail);

	res.status(200).json({
		message: "Verification email resent",
	});
};

const login = async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });
	if (!user) {
		throw HttpError(401, "Email or password  is wrong");
	}
	if (!user.verify) {
		throw HttpError(401, "Email not verified");
	}

	const passwordCompare = await bcrypt.compare(password, user.password);
	if (!passwordCompare) {
		throw HttpError(401, "Email or password  is wrong");
	}

	const { _id: id } = user;
	const payloaad = {
		id,
	};

	const token = jwt.sign(payloaad, JWT_SECRET, { expiresIn: "72h" });
	await User.findByIdAndUpdate(id, { token });

	res.status(200).json({
		token,
		user: {
			email: email,
		},
	});
};

const getCurrent = async (req, res) => {
	const { username, email } = req.user;
	res.json({ username, email });
};

const logout = async (req, res) => {
	const { _id } = req.user;
	await User.findByIdAndUpdate(_id, { token: "" });

	res.status(204).json({
		message: "No Content",
	});
};

const updateAvatar = async (req, res) => {
	const { _id } = req.user;
	const { path: oldPath, filename } = req.file;
	const newPath = path.join(avatarPath, filename);
	await fs.rename(oldPath, newPath);
	const avatarURL = path.join("avatars", filename);
	await User.findByIdAndUpdate(_id, { avatarURL });

	res.status(200).json({
		avatarURL,
	});
};

export default {
	register: ctrlWrapper(register),
	verify: ctrlWrapper(verify),
	resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
	login: ctrlWrapper(login),
	getCurrent: ctrlWrapper(getCurrent),
	logout: ctrlWrapper(logout),
	updateAvatar: ctrlWrapper(updateAvatar),
};
