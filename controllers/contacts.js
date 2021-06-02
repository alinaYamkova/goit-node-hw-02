const Contacts = require("../repositories/contacts");

const listContacts = async (req, res, next) => {
  console.log('GET')
  try {
    const contacts = await Contacts.listContacts();
    if (contacts) {
      return res.json({ status: "success", code: 200, data: { contacts } });
    }
    return res.json({ status: "error", code: 404, message: "Not found" });
  } catch (e) {
    next(e);
  }
};

const getContactById = async (req, res, next) => {
  console.log('GET_id')
  try {
    const contactId = await Contacts.getContactById(req.params.id);
    if (contactId) {
      console.log(contactId)
      return res.json({ status: "success", code: 200, data: { contactId } });
    }
    return res.json({ status: "error", code: 404, message: "Not found" });
  } catch (e) {
    next(e);
  }
};

const addContact =  async (req, res, next) => {
  console.log('POST')
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
  console.log('DEL')
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
  console.log('PUT')
  try {
    const contact = await Contacts.updateContact(req.params.id, req.body);
    if (contact) {
      return res.json({ status: "success", code: 200, data: { contact } });
    }
    return res.json({ error: "error", code: 404, message: "Not found" });
  } catch (e) {
    next(e);
  }
};


module.exports = {
  listContacts, 
  getContactById, 
  addContact, 
  removeContact, 
  updateContact,
}
