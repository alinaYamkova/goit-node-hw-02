const Contact = require('../model/contact_schema')

const listContacts = async () => {
  const results = await Contact.find();
  console.log(results)
  return results;
};

const getContactById = async (id) => {
  const results = await Contact.findOne({ _id: id });
  return results;
};

const removeContact = async (id) => {
  const result = await Contact.findOneAndRemove({ _id: id });
  return result;
};

const addContact = async (body) => {
  const result = await Contact.create(body);
  return result;
};

const updateContact = async (id, body) => {
  const result = await Contact.findOneAndUpdate(
    { _id: id },
    { ...body },
    { new: true },
  );
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
