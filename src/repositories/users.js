const User = require('../model/user_schema');

const findById = async (id) => {
  return await User.findById(id);
};

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const findByVerifyToken = async (verifyToken) => {
  return await User.updateOne({ verifyToken });
};

const createUser = async (body) => {
  const user = new User(body);
  return await user.save();
};  

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};  

const updateTokenVerify = async (id, isVerified, verifyToken) => {
  return await User.updateOne({ _id: id }, { isVerified, verifyToken });
};

const updateAvatar = async (id, avatar, idCloudAvatar = null) => {
  return await User.updateOne({ _id: id }, { avatar, idCloudAvatar })
};  



module.exports = {
  findById,
  findByEmail,
  findByVerifyToken,
  createUser,
  updateToken,
  updateTokenVerify,
  updateAvatar,
};
