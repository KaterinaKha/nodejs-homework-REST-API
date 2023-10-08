import { Schema, model } from "mongoose";

import { handleSaveError, runValidateAtUpdate } from "./hooks.js";

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
	{
		username: {
			type: "string",
			required: true,
		},
		email: {
			type: String,
			match: emailRegexp,
			unique: true,
			required: [true, "Email is required"],
		},
		password: {
			type: String,
			required: [true, "Set password for user"],
			minlength: 6,
		},
		subscription: {
			type: String,
			enum: ["starter", "pro", "business"],
			default: "starter",
		},
		token: String,

		avatarURL: String,

		verify: {
			type: Boolean,
			default: false,
		},

		verificationToken: {
			type: String,
			// required: [true, "Verify token is required"],
		},
	},
	{ versionKey: false, timestamps: true }
);

userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", runValidateAtUpdate);
userSchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", userSchema);

export default User;
