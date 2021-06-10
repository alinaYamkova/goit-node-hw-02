const Contacts = require('../repositories/contacts');
const { HttpCode } = require('../helpers/constants');

const listContacts = async (req, res, next) => {
  console.log('GET');
  try {
    const userId = req.user.id;
    const { docs: contacts, ...rest } = await Contacts.listContacts(
      userId,
      req.query,
    );
    if (contacts) {
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        data: { contacts, ...rest },
      });
    }
  } catch (e) {
    next(e);
  }
};

const getContactById = async (req, res, next) => {
  console.log('GET_id');
  try {
    const userId = req.user.id;
    const contactId = await Contacts.getContactById(userId, req.params.id);
    if (contactId) {
      console.log(contactId);
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        data: { contactId },
      });
    }
    return res.json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found',
    });
  } catch (e) {
    next(e);
  }
};

const addContact = async (req, res, next) => {
  console.log('POST');
  try {
    const userId = req.user.id;
    const newContact = await Contacts.addContact(userId, req.body);
    if (!newContact) {
      return res.json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'missing required name field',
      });
    }
    return res.status(201).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: { newContact },
    });
  } catch (e) {
    next(e);
  }
};

const removeContact = async (req, res, next) => {
  console.log('DEL');
  try {
    const userId = req.user.id;
    const contact = await Contacts.removeContact(userId, req.params.id);
    if (contact) {
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        data: { contact },
      });
    }
    return res.json({
      error: 'success',
      code: HttpCode.NOT_FOUND,
      message: 'Not found',
    });
  } catch (e) {
    next(e);
  }
};

const updateContact = async (req, res, next) => {
  console.log('PUT');
  try {
    const userId = req.user.id;
    const contact = await Contacts.updateContact(
      userId,
      req.params.id,
      req.body,
    );
    if (contact) {
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        data: { contact },
      });
    }
    return res.json({
      error: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found',
    });
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
};
