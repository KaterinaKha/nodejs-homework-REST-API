import { isValidObjectId } from "mongoose";
import { HttpError } from "../helpers/index.js";

const isValidId = (req, res, next) => {
	const id = req.params.contactId;
	if (!isValidObjectId(id)) {
		return next(HttpError(404, `${id} is not a valid`));
	}
	next();
};

export default isValidId;
