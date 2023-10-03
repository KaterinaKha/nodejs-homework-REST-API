import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";

import User from "../models/User.js";

import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const { JWT_SECRET } = process.env;
const avatarPath = path.resolve("public", "avatars");

const register = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (user) {
		throw HttpError(409, "Email in use");
	}

	const hashPassword = await bcrypt.hash(password, 10);
	const avatarURL = gravatar.url(email);
	const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL });

	res.status(201).json({
		username: newUser.username,
		email: newUser.email,
	});
};

const login = async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });
	if (!user) {
		throw HttpError(401, "Email or password  is wrong");
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

	// if (!User) {
	// 	throw HttpError(401, "Not authorized");
	// }

	res.status(200).json({
		avatarURL,
	});
};

export default {
	register: ctrlWrapper(register),
	login: ctrlWrapper(login),
	getCurrent: ctrlWrapper(getCurrent),
	logout: ctrlWrapper(logout),
	updateAvatar: ctrlWrapper(updateAvatar),
};
