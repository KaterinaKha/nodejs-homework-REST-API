import { Router } from "express";

import contactController from "../../controllers/contact-controller.js";

import * as contactSchemas from "../../models/Contact.js";

import { validateBody } from "../../decorators/index.js";

import { isValidId } from "../../middlewares/index.js";

const router = Router();

const contactAddValidate = validateBody(contactSchemas.contactAddShcema);
const contactUpdateFavoriteValidate = validateBody(contactSchemas.contactUpdateFavoriteSchema);

router.get("/", contactController.getAllContacts);

router.get("/:contactId", isValidId, contactController.getContactById);

router.post("/", contactAddValidate, contactController.addContact);

router.put("/:contactId", isValidId, contactAddValidate, contactController.updateContact);
router.patch("/:contactId/favorite", isValidId, contactUpdateFavoriteValidate, contactController.updateContact);

router.delete("/:contactId", contactController.deleteContact);

export default router;
