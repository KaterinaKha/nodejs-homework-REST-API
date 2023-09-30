import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const { JWT_SECRET } = process.env;

const register = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (user) {
		throw HttpError(409, "Email in use");
	}

	const hashPassword = await bcrypt.hash(password, 10);
	const newUser = await User.create({ ...req.body, password: hashPassword });

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
	const { name, email } = req.user;
	res.json({ name, email });
};

const logout = async (req, res) => {
	const { _id } = req.user;
	await User.findByIdAndUpdate(_id, { token: "" });

	res.status(204).json({
		message: "No Content",
	});
};

export default {
	register: ctrlWrapper(register),
	login: ctrlWrapper(login),
	getCurrent: ctrlWrapper(getCurrent),
	logout: ctrlWrapper(logout),
};
