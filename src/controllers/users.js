const Users = require('../repositories/users');
const { HttpCode } = require('../helpers/constants');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

const register = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);

    if (user) {
      res.status(HttpCode.CONFLICT).json({
        contentType: application / json,
        status: 'error',
        code: HttpCode.CONFLICT,
        message: 'Email is already used',
      })
      return; 
    }

    const { id, name, email, subscription, gender } = await Users.createUser(req.body);
    return res.status(HttpCode.CREATED).json({
      contentType: application / json,
      status: 'succes',
      code: HttpCode.CREATED,
      data: { id, name, email, subscription, gender },
      message: 'New user was created',
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    console.log('user:', user);
    const isValidPassword = await user?.isValidPassword(req.body.password);
    if (!user || !isValidPassword) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        contentType: application / json,
        code: HttpCode.UNAUTHORIZED,
        message: "Email or password is wrong",
      });
    }

    const id = user.id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
    await Users.updateToken(id, token);
    return res.json({
      status: 'success',
      code: HttpCode.OK,
      data: { token },
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    const id = req.user.id;
    await Users.updateToken(id, null);
    return res.status(HttpCode.NO_CONTENT).json({});
  } catch (e) {
    next(e);
  }
};


module.exports = {
  register,
  login,
  logout,
};
