import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

import Contact from "../models/Contact.js";

const getAllContacts = async (req, res) => {
	const result = await Contact.find({}, "name email phone favorite");
	res.status(200).json(result);
};

const addContact = async (req, res) => {
	const result = await Contact.create(req.body);
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
