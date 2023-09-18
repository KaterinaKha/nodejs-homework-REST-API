import Joi from "joi";

const contactAddShcema = Joi.object({
	name: Joi.string().min(3).max(30).required(),
	email: Joi.string().email().required(),
	phone: Joi.string().required(),
	favorite: Joi.boolean().required(),
});

const contactUpdateFavoriteSchema = Joi.object({
	favorite: Joi.boolean().required(),
});

export default {
	contactAddShcema,
	contactUpdateFavoriteSchema,
};
