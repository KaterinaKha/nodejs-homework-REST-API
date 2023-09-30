import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

import Contact from "../models/Contact.js";

const getAllContacts = async (req, res) => {
	const { _id: owner } = req.user;
	const { page = 1, limit = 20 } = req.query;
	const skip = (page - 1) * limit;
	const result = await Contact.find({ owner }, "name email phone favorite", { skip, limit }).populate(
		"owner",
		"name email"
	);
	res.status(200).json(result);
};

const addContact = async (req, res) => {
	const { _id: owner } = req.user;
	const result = await Contact.create({ ...req.body, owner });
	res.status(201).json(result);
};

const getContactById = async (req, res) => {
	const contactId = req.params.contactId;
	const result = await Contact.findById(contactId);
	if (!result) {
		throw HttpError(404, `Contact id=${contactId} is not found`);
	}
	res.status(200).json(result);
};

const updateContact = async (req, res) => {
	const contactId = req.params.contactId;
	const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
	if (!result) {
		throw HttpError(404, `Contact id=${contactId} not found`);
	}
	res.status(200).json(result);
};

const deleteContact = async (req, res) => {
	const contactId = req.params.contactId;
	const result = await Contact.findByIdAndDelete(contactId);
	if (!result) {
		throw HttpError(404, "Not found!");
	}
	res.status(200).json({ message: "Contact removed" });
};

export default {
	getAllContacts: ctrlWrapper(getAllContacts),
	addContact: ctrlWrapper(addContact),
	getContactById: ctrlWrapper(getContactById),
	updateContact: ctrlWrapper(updateContact),
	deleteContact: ctrlWrapper(deleteContact),
};
