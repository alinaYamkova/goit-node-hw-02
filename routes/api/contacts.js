const express = require("express");
const router = express.Router();
const Contacts = require("../../model");
const {
  validationCreateContact,
  validationUpdateContact,
  validationUpdateStatusContact,
} = require("./validation");

router.get("/", async (req, res, next) => {
  try {
    const contact = await Contacts.listContacts();
    return res.json({ status: "success", code: 200, data: { contact } });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const contactId = await Contacts.getContactById(req.params.id);
    if (contactId) {
      return res.json({ status: "success", code: 200, data: { contactId } });
    }
    return res.json({ status: "error", code: 404, message: "Not found" });
  } catch (e) {
    next(e);
  }
});

router.post("/", validationCreateContact, async (req, res, next) => {
  try {
    const newContact = await Contacts.addContact(req.body);
    if (!newContact) {
      return res.json({
        status: "error",
        code: 400,
        message: "missing required name field",
      });
    }
    return res
      .status(201)
      .json({ status: "success", code: 201, data: { newContact } });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const contact = await Contacts.removeContact(req.params.id);
    if (contact) {
      return res.json({ status: "success", code: 200, data: { contact } });
    }
    return res.json({ error: "success", code: 404, message: "Not found" });
  } catch (e) {
    next(e);
  }
});

router.put("/:id", validationUpdateContact, async (req, res, next) => {
  try {
    const contact = await Contacts.updateContact(req.params.id, req.body);
    if (contact) {
      return res.json({ status: "success", code: 200, data: { contact } });
    }
    return res.json({ error: "success", code: 404, message: "Not found" });
  } catch (e) {
    next(e);
  }
});

router.patch("/:id/favorite", validationUpdateStatusContact, async (req, res, next) => {
    try {
      const contact = await Contacts.updateContact(req.params.id, req.body);
      if (contact) {
        return res.json({ status: "success", code: 200, data: { contact } });
      }
      return res.json({ status: "error", code: 404, message: "Not found" });
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
