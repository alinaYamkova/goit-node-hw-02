const { readFile } = require('fs')
const fs = require('fs/promises')
const path = require('path')
const { v4: uuid } = require('uuid')
// const contacts = require('./contacts.json')

const readData = async () => {
  const data = await fs.readFile(path.join(__dirname, 'contacts.json'), 'utf-8')
  return JSON.parse (data);
}

const listContacts = async () => {
  return await readData();
}

const getContactById = async (id) => {
  const data = await readData()
  const someContact = data.find((el) => el.id === id);
  console.table(someContact);
  return someContact;
}

const removeContact = async (id) => {
  const data = await readData()
  const someContact = data.find((el) => el.id === id);
  const contactList = data.filter((el) => el.id !== id);
  await fs.writeFile(path.join(__dirname, 'contacts.json'), JSON.stringify(contactList))
  console.table(someContact);
  return contactList;
}
// removeContact("3810901a-267f-4224-8db7-76d8bf854e28")

const addContact = async (body) => {
  const data = await readData()
  const newContact = { id: uuid(), ...body };
  const contactsList = [...data, newContact];
  await fs.writeFile(path.join(__dirname, 'contacts.json'), JSON.stringify(contactsList))
  console.table(contactsList);
  return newContact;
}
// addContact('Morton', 'okl.Fusce.diam@Donec.com', '(111) 738-2360')

const updateContact = async (id, body) => {
  const data = await readData()
  const [result] =  data.filter((el) => el.id === id)
  if (result) {
    Object.assign(result, body)
    await fs.writeFile(path.join(__dirname, 'contacts.json'), JSON.stringify(data))
  }
  return result;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
