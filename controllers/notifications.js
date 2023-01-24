const Notification = require('../models/notification');
const BadRequestError = require('../utils/bad-request-error');
const NotFoundError = require('../utils/not-found-error');

const {
  OK_STATUS,
} = require('../utils/constants');

const getNotifications = (_, res, next) => {
  Notification.find({})
    .then((notifications) => res.status(OK_STATUS).send({ notifications }))
    .catch((err) => next(err));
};

const createNotification = (req, res, next) => {
  const {
    title,
    message,
    author,
    customer,
    customerGroups,
  } = req.body;
  Notification.create({
    title,
    message,
    author,
    customer,
    customerGroups,
    runValidators: true,
  })
    .then((notification) => res.status(OK_STATUS).send({ notification }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании сообщения'));
      } else {
        next(err);
      }
    });
};

const getNotification = (req, res, next) => {
  Notification.findById(req.params.notificationId)
    // .populate('customerGroups')
    .then((notification) => {
      if (!notification) {
        throw new NotFoundError('Сообщение с таким id не найдено');
      }
      return res.status(OK_STATUS).send({ notification });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id получателя'));
      } else {
        next(err);
      }
    });
};

const updateNotification = (req, res, next) => {
  const {
    title,
    message,
    author,
    customer,
  } = req.body;
  Notification.findByIdAndUpdate(req.body.id, {
    title,
    message,
    author,
    customer,
  }, { new: true, runValidators: true })
    .then((notification) => {
      if (!notification) {
        throw new NotFoundError('Сообщение с указанным id не найдено');
      }
      res.status(OK_STATUS).send(notification);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании получателя'));
      } else {
        next(err);
      }
    });
};

const handleGroup = (method, req, res, next) => {
  const groupId = method === '$pull' ? req.params.groupId : req.body.groupId;
  Notification.findByIdAndUpdate(
    req.params.notificationId,
    { [method]: { customerGroups: groupId } },
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

const handleCustomer = (method, req, res, next) => {
  const customerId = method === '$pull' ? req.params.customerId : req.body.customerId;
  Notification.findByIdAndUpdate(
    req.params.notificationId,
    { [method]: { customers: customerId } },
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

const addCustomer = (req, res, next) => {
  handleCustomer('$addToSet', req, res, next);
};

const removeCustomer = (req, res, next) => {
  handleCustomer('$pull', req, res, next);
};

const deleteNotification = (req, res, next) => {
  Notification.findByIdAndDelete(req.params.notificationId)
    .then((notification) => {
      if (!notification) {
        throw new NotFoundError('Сообщение с таким id не найдена');
      }
      return res.status(OK_STATUS).send({ notification });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id сообщения'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getNotifications,
  createNotification,
  getNotification,
  updateNotification,
  addGroup,
  removeGroup,
  addCustomer,
  removeCustomer,
  deleteNotification,
};
