const Contacts = require("../repositories/contacts");

const listContacts =  async (req, res, next) => {
  console.log('Hi-GET')
  try {
    const contacts = await Contacts.listContacts();
    return res.json({ status: "success", code: 200, data: { contacts } });
  } catch (e) {
    next(e);
  }
};

const getContactById =  async (req, res, next) => {
  console.log('Hi-GET')
  try {
    const contactId = await Contacts.getContactById(req.params.id);
    if (contactId) {
      console.log(contactId._id.getTimestamp())
      return res.json({ status: "success", code: 200, data: { contactId } });
    }
    return res.json({ status: "error", code: 404, message: "Not found" });
  } catch (e) {
    next(e);
  }
};

const addContact =  async (req, res, next) => {
  console.log('Hi-POST')
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
};

const removeContact = async (req, res, next) => {
  console.log('Hi-DEL')
  try {
    const contact = await Contacts.removeContact(req.params.id);
    if (contact) {
      return res.json({ status: "success", code: 200, data: { contact } });
    }
    return res.json({ error: "success", code: 404, message: "Not found" });
  } catch (e) {
    next(e);
  }
};

const updateContact = async (req, res, next) => {
  console.log('Hi-PUT')
  try {
    const contact = await Contacts.updateContact(req.params.id, req.body);
    if (contact) {
      return res.json({ status: "success", code: 200, data: { contact } });
    }
    return res.json({ error: "success", code: 404, message: "Not found" });
  } catch (e) {
    next(e);
  }
};


module.exports = {
  listContacts, 
  getContactById, 
  addContact, removeContact, 
  updateContact,
}
