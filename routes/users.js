const router = require('express').Router();
const {
  getUsers, updateProfile, addRole, removeRole, getUser, getCurrentUser,
} = require('../controllers/users');

const { updateProfileValidate, validateGetUser } = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validateGetUser, getUser);
router.patch('/me', updateProfileValidate, updateProfile);
router.put('/:userId/roles', addRole);
router.delete('/:userId/roles/:roleId', removeRole);

module.exports = router;
