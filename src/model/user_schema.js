const { Schema, model, SchemaTypes } = require('mongoose');
const gravatar = require('gravatar');
const { Subscription, Gender } = require('../helpers/constants');
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 8;

const { STARTER, PRO, BUSINESS } = Subscription;
const { MALE, FEMALE, NONE } = Gender;

const userSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 2,
      default: 'Guest',
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate(value) {
        const re = /\S+@\S+\.\S+/g;
        return re.test(String(value).toLowerCase());
      },
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    },
    subscription: {
      type: String,
      enum: [STARTER, PRO, BUSINESS],
      default: STARTER,
    },
    gender: {
      type: String,
      enum: [MALE, FEMALE, NONE],
      default: NONE,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    token: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: function () {
        return gravatar.url(this.email, { size: '250' }, true);
      },
    },
    idCloudAvatar: {
      type: String,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
    this.password = await bcrypt.hash(this.password, salt)
  }
  next()
});

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = model('user', userSchema);

module.exports = User;
