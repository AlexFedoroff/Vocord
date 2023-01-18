const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const BadRequestError = require('../utils/bad-request-error');
const ConflictError = require('../utils/conflict-error');
const NotFoundError = require('../utils/not-found-error');
const UnauthorizedError = require('../utils/unauthorized-error');

const {
  OK_STATUS, SECRET_KEY,
} = require('../utils/constants');

const getUsers = (_, res, next) => {
  User.find({})
    .then((users) => res.status(OK_STATUS).send({ users }))
    .catch((err) => next(err));
};

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      login: req.body.login,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.status(OK_STATUS).send({
      _id: user.id,
      login: user.login,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректный запрос'));
      } else if (err.code === 11000) {
        next(new ConflictError('Учетные данные уже используются'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { username, password } = req.body;
  return User.findUserByCredentials(username, password)
    .then((user) => res.send({
      token: jwt.sign(
        { _id: user._id },
        SECRET_KEY,
        { expiresIn: '7d' },
      ),
    }))
    .catch((err) => next(new UnauthorizedError(err.message)));
};

const getUserById = (userId, res, next) => {
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с таким id не найден');
      }
      return res.status(OK_STATUS).send(user.toObject({
        transform: (_, resp) => {
          // eslint-disable-next-line no-param-reassign
          delete resp.password;
          return resp;
        },
      }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id пользователя'));
      } else {
        next(err);
      }
    });
};

const getUser = (req, res, next) => {
  getUserById(req.params.userId, res, next);
};

const getCurrentUser = (req, res, next) => {
  getUserById(req.user._id, res, next);
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным id не найден');
      }
      res.status(OK_STATUS).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные профиля'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным id не найден');
      }
      res.status(OK_STATUS).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректный запрос'));
      } else {
        next(err);
      }
    });
};

const handleRole = (method, req, res, next) => {
  const roleId = method === '$pull' ? req.params.roleId : req.body.roleId;

  User.findByIdAndUpdate(
    req.params.userId,
    { [method]: { roles: roleId } },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      next(new NotFoundError('Запись не найдена'));
    })
    .then((user) => {
      res.status(OK_STATUS).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const addRole = (req, res, next) => {
  handleRole('$addToSet', req, res, next);
};

const removeRole = (req, res, next) => {
  handleRole('$pull', req, res, next);
};

module.exports = {
  getUsers,
  createUser,
  login,
  getUser,
  getCurrentUser,
  updateProfile,
  updateAvatar,
  addRole,
  removeRole,
};
