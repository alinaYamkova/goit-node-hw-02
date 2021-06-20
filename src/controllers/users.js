const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const Users = require('../repositories/users');
const { HttpCode } = require('../helpers/constants');
require('dotenv').config();
const EmailService = require('../services/email');
const { CreateSenderSandGrid } = require('../services/email-sender');

const SECRET_KEY = process.env.SECRET_KEY;

const register = async (req, res, next) => {
  try {
    const newUser = await Users.findByEmail(req.body.email);

    if (newUser) {
      return res.status(HttpCode.CONFLICT).json({
        contentType: application / json,
        status: 'error',
        code: HttpCode.CONFLICT,
        message: 'Email is already used',
      });
    }

    const {
      id,
      name,
      email,
      subscription,
      gender,
      avatar,
      verifyToken,
    } = await Users.createUser(req.body);

    try {
      const emailService = new EmailService(
        process.env.NODE_ENV,
        new CreateSenderSandGrid(),
      );
      await emailService.sendVerifyEmail(verifyToken, email, name);
    } catch (error) {
      console.log(error.message);
    }

    return res.status(HttpCode.CREATED).json({
      status: 'succes',
      code: HttpCode.CREATED,
      data: { id, name, email, subscription, gender, avatar },
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
    if (!user || !isValidPassword || !user.isVerified) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        contentType: application / json,
        code: HttpCode.UNAUTHORIZED,
        message: 'Email or password is wrong',
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

// local upload
const path = require('path');
const UploadAvatarService = require('../services/local_upload');

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id;
    const uploads = new UploadAvatarService(process.env.AVATAR_OF_USERS);
    const avatarUrl = await uploads.saveAvatar({ idUser: id, file: req.file });

    try {
      await fs.unlink(path.join(process.env.AVATAR_OF_USERS, req.user.avatar));
    } catch (e) {
      console.log(e.message);
    }

    await Users.updateAvatar(id, avatarUrl);
    res.json({
      status: 'success',
      code: HttpCode.OK,
      data: { avatarUrl },
    });
  } catch (error) {
    next(error);
  }
};

/*
cloud_upload

const UploadAvatarService = require('../services/cloud_upload');
const avatars = async (req, res, next) => {
  try {
    const id = req.user.id
    const uploads = new UploadAvatarService('avatars')
    const { idCloudAvatar, avatarUrl } = await uploads.saveAvatar(
      req.file.path,
      req.user.idCloudAvatar,
    );

    await fs.unlink(req.file.path)
    await Users.updateAvatar(id, avatarUrl, idCloudAvatar)
    res.json({
      status: 'success',
      code: HttpCode.OK,
      data: { avatarUrl },
    });
  } catch (error) {
    next(error);
  }
};
*/

module.exports = {
  register,
  login,
  logout,
  avatars,
};
