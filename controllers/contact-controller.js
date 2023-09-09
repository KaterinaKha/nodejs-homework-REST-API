import contacts from "../models/contacts-models.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const getAllContacts = async (req, res) => {
	const result = await contacts.listContacts();
	if (!result) {
		throw HttpError(404, "Not found");
	}
	res.status(200).json(result);
};

const getContactById = async (req, res) => {
	const contactId = req.params.contactId;
	const result = await contacts.getContactById(contactId);
	if (!result) {
		throw HttpError(404, `Contact id=${contactId} is not found`);
	}
	res.status(200).json(result);
};

const addContact = async (req, res) => {
	const result = await contacts.addContact(req.body);
	console.log(result);
	res.status(201).json(result);
};

const deleteContact = async (req, res) => {
	const contactId = req.params.contactId;
	const result = await contacts.removeContact(contactId);
	if (!result) {
		throw HttpError(404, "Not found");
	}
	res.status(200).send().json({ message: "Contact removed" });
};

const updateContact = async (req, res) => {
	const contactId = req.params.contactId;
	const result = await contacts.updateContact(contactId, req.body);
	if (!result) {
		throw HttpError(404, "Not found");
	}
	res.status(200).json(result);
};

export default {
	getAllContacts: ctrlWrapper(getAllContacts),
	getContactById: ctrlWrapper(getContactById),
	addContact: ctrlWrapper(addContact),
	updateContact: ctrlWrapper(updateContact),
	deleteContact: ctrlWrapper(deleteContact),
};
