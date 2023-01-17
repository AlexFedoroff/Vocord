const Customer = require('../models/customer');
const BadRequestError = require('../utils/bad-request-error');
const ConflictError = require('../utils/conflict-error');
const NotFoundError = require('../utils/not-found-error');

const {
  OK_STATUS,
} = require('../utils/constants');

const getCustomers = (_, res, next) => {
  Customer.find({})
    .then((roles) => res.status(OK_STATUS).send({ roles }))
    .catch((err) => next(err));
};

const createCustomer = (req, res, next) => {
  const {
    firstName,
    midName,
    lastName,
    email,
    phone,
    description,
  } = req.body;
  Customer.create({
    firstName,
    midName,
    lastName,
    email,
    phone,
    description,
    runValidators: true,
  })
    .then((customer) => res.status(OK_STATUS).send({ customer }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании получателя'));
      } else if (err.code === 11000) {
        next(new ConflictError('Такой получатель уже существует'));
      } else {
        next(err);
      }
    });
};

const getCustomer = (req, res, next) => {
  Customer.findById(req.params.customerId)
    .then((customer) => {
      if (!customer) {
        throw new NotFoundError('Получатель с таким id не найден');
      }
      return res.status(OK_STATUS).send({ customer });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id получателя'));
      } else {
        next(err);
      }
    });
};

const updateCustomer = (req, res, next) => {
  const {
    firstName,
    midName,
    lastName,
    email,
    phone,
    description,
  } = req.body;
  Customer.findByIdAndUpdate(req.customerGroup._id, {
    firstName,
    midName,
    lastName,
    email,
    phone,
    description,
  }, { new: true, runValidators: true })
    .then((customer) => {
      if (!customer) {
        throw new NotFoundError('Получатель с указанным id не найдена');
      }
      res.status(OK_STATUS).send(customer);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании получателя'));
      } else if (err.code === 11000) {
        next(new ConflictError('Такой получатель уже существует'));
      } else {
        next(err);
      }
    });
};

const handleGroup = (method, req, res, next) => {
  const groupId = method === '$pull' ? req.params.groupId : req.body.groupId;
  Customer.findByIdAndUpdate(
    req.params.customerId,
    { [method]: { groups: groupId } },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      next(new NotFoundError('Запись не найдена'));
    })
    .then((group) => {
      res.status(OK_STATUS).send(group);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const addGroup = (req, res, next) => {
  handleGroup('$addToSet', req, res, next);
};

const removeGroup = (req, res, next) => {
  handleGroup('$pull', req, res, next);
};

const deleteCustomer = (req, res, next) => {
  Customer.findByIdAndDelete(req.params.customerId)
    .then((customer) => {
      if (!customer) {
        throw new NotFoundError('Получатель с таким id не найдена');
      }
      return res.status(OK_STATUS).send({ customer });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id получателя'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCustomers,
  createCustomer,
  getCustomer,
  updateCustomer,
  addGroup,
  removeGroup,
  deleteCustomer,
};
