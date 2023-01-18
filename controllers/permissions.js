const Permission = require('../models/permission');
const BadRequestError = require('../utils/bad-request-error');
const ConflictError = require('../utils/conflict-error');
const NotFoundError = require('../utils/not-found-error');

const {
  OK_STATUS,
} = require('../utils/constants');

const getPermissions = (_, res, next) => {
  Permission.find({})
    .then((permissions) => res.status(OK_STATUS).send({ permissions }))
    .catch((err) => next(err));
};

const createPermission = (req, res, next) => {
  const { title } = req.body;
  Permission.create({
    title, runValidators: true,
  })
    .then((permission) => res.status(OK_STATUS).send({ permission }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании разрешения'));
      } else if (err.code === 11000) {
        next(new ConflictError('Такое разрешение уже существует'));
      } else {
        next(err);
      }
    });
};

const getPermission = (permissionId, res, next) => {
  Permission.findById(permissionId)
    .then((permission) => {
      if (!permission) {
        throw new NotFoundError('Разрешение с таким id не найдено');
      }
      return res.status(OK_STATUS).send({ permission });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id разрешения'));
      } else {
        next(err);
      }
    });
};

const updatePermission = (req, res, next) => {
  const { title } = req.body;
  Permission.findByIdAndUpdate(req.body.id, {
    title,
  }, { new: true, runValidators: true })
    .then((permission) => {
      if (!permission) {
        throw new NotFoundError('Разрешение с указанным id не найдено');
      }
      res.status(OK_STATUS).send(permission);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании группы'));
      } else if (err.code === 11000) {
        next(new ConflictError('Такая группа уже существует'));
      } else {
        next(err);
      }
    });
};

const deletePermission = (req, res, next) => {
  Permission.findByIdAndDelete(req.params.permissionId)
    .then((permission) => {
      if (!permission) {
        throw new NotFoundError('Разрешение с таким id не найдено');
      }
      return res.status(OK_STATUS).send({ permission });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id разрешения'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getPermissions,
  createPermission,
  getPermission,
  updatePermission,
  deletePermission,
};
