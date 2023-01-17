const router = require('express').Router();
const auth = require('../middlewares/auth');
const usersRoutes = require('./users');
const rolesRoutes = require('./roles');
const customersRoutes = require('./customers');
const custGroupsRoutes = require('./customerGroups');

const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../utils/not-found-error');
const { loginValidate, registerValidate } = require('../middlewares/validation');

router.post('/signup', registerValidate, createUser);
router.post('/signin', loginValidate, login);

router.use(auth);
router.use('/users', usersRoutes);
router.use('/roles', rolesRoutes);
router.use('/customers', customersRoutes);
router.use('/customergroups', custGroupsRoutes);

router.use('*', (_, __, next) => { next(new NotFoundError('404 - Страница не найдена')); });

module.exports = router;
