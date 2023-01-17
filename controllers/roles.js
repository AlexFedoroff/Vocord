const Role = require('../models/role');
const BadRequestError = require('../utils/bad-request-error');
const ConflictError = require('../utils/conflict-error');
const NotFoundError = require('../utils/not-found-error');

const {
  OK_STATUS,
} = require('../utils/constants');

const getRoles = (_, res, next) => {
  Role.find({})
    .then((roles) => res.status(OK_STATUS).send({ roles }))
    .catch((err) => next(err));
};

const createRole = (req, res, next) => {
  const { title, description } = req.body;
  Role.create({
    title, description, runValidators: true,
  })
    .then((role) => res.status(OK_STATUS).send({ role }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании роли'));
      } else if (err.code === 11000) {
        next(new ConflictError('Такая роль уже существует'));
      } else {
        next(err);
      }
    });
};

const getRole = (req, res, next) => {
  Role.findById(req.params.roleId)
    .then((role) => {
      if (!role) {
        throw new NotFoundError('Роль с таким id не найдена');
      }
      return res.status(OK_STATUS).send({ role });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id роли'));
      } else {
        next(err);
      }
    });
};

const deleteRole = (req, res, next) => {
  Role.findByIdAndDelete(req.params.roleId)
    .then((role) => {
      if (!role) {
        throw new NotFoundError('Роль с таким id не найдена');
      }
      return res.status(OK_STATUS).send({ role });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id роли'));
      } else {
        next(err);
      }
    });
};

const updateRole = (req, res, next) => {
  const { title, description } = req.body;
  Role.findByIdAndUpdate(
    req.body.id,
    { title, description },
    { new: true, runValidators: true },
  )
    .then((role) => {
      if (!role) {
        throw new NotFoundError('Роль с указанным id не найдена');
      }
      res.status(OK_STATUS).send(role);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании роли'));
      } else if (err.code === 11000) {
        next(new ConflictError('Такая роль уже существует'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getRoles,
  createRole,
  getRole,
  updateRole,
  deleteRole,
};
