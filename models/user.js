const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { isEmail } = require('validator');
const UnauthorizedError = require('../utils/unauthorized-error');

const userSchema = new mongoose.Schema({
  login: {
    type: String,
    minlength: 8,
    maxlength: 30,
    unique: true,
  },
  email: {
    type: String,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Некорректный email',
    },
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
    ref: 'role',
  }],
  created_at: { type: Date, default: Date.now },
});

userSchema.statics.findUserByCredentials = function auth(username, password) {
  return this.findOne({ username })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неверный login или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неверный login или пароль');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
