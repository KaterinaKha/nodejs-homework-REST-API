import contactSchema from "../../schemas/contact-schema.js";
import { validateBody } from "../../decorators/index.js";

const addContactValidate = validateBody(contactSchema.contactShcema);

export default {
	addContactValidate,
};
