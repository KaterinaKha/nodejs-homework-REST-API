import { Router } from "express";

import { validateBody } from "../../decorators/index.js";
import { authenticate, isValidId } from "../../middlewares/index.js";

import contactSchemas from "../../Schemas/contact-schemas.js";
import contactController from "../../controllers/contact-controller.js";

const router = Router();

router.use(authenticate);

const contactAddValidate = validateBody(contactSchemas.contactAddShcema);
const contactUpdateFavoriteValidate = validateBody(contactSchemas.contactUpdateFavoriteSchema);

router.get("/", contactController.getAllContacts);

router.get("/:contactId", isValidId, contactController.getContactById);

router.post("/", contactAddValidate, contactController.addContact);

router.put("/:contactId", isValidId, contactAddValidate, contactController.updateContact);
router.patch("/:contactId/favorite", isValidId, contactUpdateFavoriteValidate, contactController.updateContact);

router.delete("/:contactId", contactController.deleteContact);

export default router;
