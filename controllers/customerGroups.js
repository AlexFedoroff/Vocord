const CustomerGroup = require('../models/customerGroup');
const BadRequestError = require('../utils/bad-request-error');
const ConflictError = require('../utils/conflict-error');
const NotFoundError = require('../utils/not-found-error');

const {
  OK_STATUS,
} = require('../utils/constants');

const getCustomerGroups = (_, res, next) => {
  CustomerGroup.find({})
    .then((roles) => res.status(OK_STATUS).send({ roles }))
    .catch((err) => next(err));
};

const createCustomerGroup = (req, res, next) => {
  const { title, description } = req.body;
  CustomerGroup.create({
    title, description, runValidators: true,
  })
    .then((customerGroup) => res.status(OK_STATUS).send({ customerGroup }))
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

const getCustomerGroup = (roleId, res, next) => {
  CustomerGroup.findById(roleId)
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

const updateCustomerGroup = (req, res, next) => {
  const { title, description } = req.body;
  CustomerGroup.findByIdAndUpdate(req.body.id, {
    title,
    description,
  }, { new: true, runValidators: true })
    .then((group) => {
      if (!group) {
        throw new NotFoundError('Группа с указанным id не найдена');
      }
      res.status(OK_STATUS).send(group);
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

const deleteCustomerGroup = (req, res, next) => {
  CustomerGroup.findByIdAndDelete(req.params.groupId)
    .then((group) => {
      if (!group) {
        throw new NotFoundError('Группа с таким id не найдена');
      }
      return res.status(OK_STATUS).send({ group });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id группы'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCustomerGroups,
  createCustomerGroup,
  getCustomerGroup,
  updateCustomerGroup,
  deleteCustomerGroup,
};
