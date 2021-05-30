const db = require('./db');
const { ObjectId } = require('mongodb');
const { object } = require('joi');

const getCollection = async (db, name) => {
  const client = await db;
  const collection = await client.db().collection(name);
  return collection;
};

const listContacts = async () => {
  const collection = await getCollection(db, 'contacts');
  const results = await collection.find({}).toArray;
  return results;
};

const getContactById = async id => {
  const collection = await getCollection(db, 'contacts');
  const objId = new ObjectId(id);
  const [result] = await collection.find({ _id: objId }).toArray;
  return result;
};

const removeContact = async id => {
  const collection = await getCollection(db, 'contacts');
  const objId = new ObjectId(id);
  const { value: result } = await collection.findOneAndDelete({ _id: objId });
  return result;
};

const addContact = async body => {
  const collection = await getCollection(db, 'contacts');
  const newContact = {
    ...body,
    ...(body.favorite ? {} : { isFavorite: false }),
  };
  const {
    ops: [result],
  } = await collection.insertOne(newContact);
  return result;
};

const updateContact = async (id, body) => {
  const collection = await getCollection(db, 'contacts');
  const objId = new ObjectId(id);
  const { value: result } = await collection.findOneAndUpdate(
    { _id: objId },
    { $set: body },
    { returnOriginal: false },
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
