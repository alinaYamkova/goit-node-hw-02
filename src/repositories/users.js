const User = require('../model/user_schema');

const findById = async (id) => {
  return await User.findById(id);
};

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const createUser = async (body) => {
  const user = new User(body);
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const getCurrentUser = async (id) => {
  const { name, email, subscription } = await this.User.findOne({ _id: id });
  return { name, email, subscription };
};

const updateAvatar = async (id, avatar, idCloudAvatar = null) => {
  return await User.updateOne({ _id: id }, { avatar, idCloudAvatar });
};


module.exports = {
  findById,
  findByEmail,
  createUser,
  updateToken,
  getCurrentUser,
  updateAvatar,
};
