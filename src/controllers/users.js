const Users = require('../repositories/users');
const { HttpCode } = require('../../helpers/constants');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

const register = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        ContentType: application / json,
        code: HttpCode.CONFLICT,
        message: 'Email is already used',
      });
    }

    const { id, name, email, gender } = await Users.createUser(req.body);
    return res.status(HttpCode.CREATED).json({
      status: 'succes',
      ContentType: application / json,
      code: HttpCode.CREATED,
      data: { id, name, email, gender },
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    console.log('user', user);

    const isValidPassword = await user?.isValidPassword(req.body.password);
    if (!user || !isValidPassword) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        ContentType: application / json,
        code: HttpCode.UNAUTHORIZED,
        message: "Email or password is wrong",
      });
    }

    const id = user.id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
    await Users.updateToken(id, token);
    return res.json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found',
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    const contacts = await Users.listContacts();
    if (contacts) {
      return res.json({ status: 'success', code: 200, data: { contacts } });
    }
    return res.json({ status: 'error', code: 404, message: 'Not found' });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  register,
  login,
  logout,
};
