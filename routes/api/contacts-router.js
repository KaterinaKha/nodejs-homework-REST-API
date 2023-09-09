import { Router } from "express";
import contactController from "../../controllers/contact-controller.js";
import contactsValidation from "../../middleware/validation/contacts-validation.js";
const router = Router();

router.get("/", contactController.getAllContacts);

router.get("/:contactId", contactController.getContactById);

router.post("/", contactsValidation.addContactValidate, contactController.addContact);

router.delete("/:contactId", contactController.deleteContact);

router.put("/:contactId", contactsValidation.addContactValidate, contactController.updateContact);

export default router;
