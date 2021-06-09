const Contact = require('../model/contact_schema');

const listContacts = async (userId, query) => {
  // const results = await Contact.find({ owner: userId }).populate({
  //   path: 'owner',
  //   select: 'name email -_id',
  // });
  // console.log(results)
  const {
    sortBy,
    sortByDesc,
    filter,
    Favorite = null,
    limit = 5,
    offset = 0,
  } = query;

  const optionsSearch = { owner: userId };
  if (favorite !== null) {
    optionsSearch.isFavorite = favorite;
  };

  const results = await Contact.paginate(optionsSearch, {
    limit,
    offset,
    sort: {
      ...(sortBy ? { [`$sortBy`]: 1 } : {}),
      ...(sortByDesc ? { [`$sortDesc`]: -1 } : {}),
    },
    select: filter ? filter.split('|').join(' ') : '',
    populate: { path: 'owner', select: 'name email' },
  });
  return results;
};

const getContactById = async (id, userId) => {
  const results = await Contact.findOne({ _id: id, owner: userId }).populate({
    path: 'owner',
    select: 'name email',
  });
  return results;
};

const removeContact = async (id, userId) => {
  const result = await Contact.findOneAndRemove({ _id: id, ownre: userId });
  return result;
};

const addContact = async (userId, body) => {
  const result = await Contact.create({ owner: userId, ...body });
  return result;
};

const updateContact = async (userId, id, body) => {
  const result = await Contact.findOneAndUpdate(
    { _id: id, owner: userId },
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
