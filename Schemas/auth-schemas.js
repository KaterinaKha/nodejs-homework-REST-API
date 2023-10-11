import Joi from "joi";

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
0;

const userSignupSchema = Joi.object({
	username: Joi.string().required(),
	email: Joi.string().pattern(emailRegexp).required(),
	password: Joi.string().min(6).required(),
});

const userSigninSchema = Joi.object({
	email: Joi.string().pattern(emailRegexp).required(),
	password: Joi.string().min(6).required(),
});

export const userEmailSchema = Joi.object({
	email: Joi.string().pattern(emailRegexp).required(),
});

export default {
	userSigninSchema,
	userSignupSchema,
	userEmailSchema,
};
