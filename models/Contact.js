import { Schema, model } from "mongoose";
import Joi from "joi";

import { handleSaveError, runValidateAtUpdate } from "./hooks.js";

const contactSchema = new Schema(
	{
		name: { type: String, required: [true, "Put contact name"] },
		email: { type: String },
		phone: { type: String, required: true },
		favorite: { type: Boolean, default: false },
	},
	{ versionKey: false, timestamps: true }
);

contactSchema.post("save", handleSaveError);
contactSchema.pre("findOneAndUpdate", runValidateAtUpdate);
contactSchema.post("findOneAndUpdate", handleSaveError);

export const contactAddShcema = Joi.object({
	name: Joi.string().min(3).max(30).required(),
	email: Joi.string().email().required(),
	phone: Joi.string().required(),
	favorite: Joi.boolean().required(),
});

export const contactUpdateFavoriteSchema = Joi.object({
	favorite: Joi.boolean().required(),
});
const Contact = model("contact", contactSchema);

export default Contact;
