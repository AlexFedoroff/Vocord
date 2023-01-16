const router = require('express').Router();
const {
  getUsers, updateProfile, addRole, removeRole, getUser, getCurrentUser,
} = require('../controllers/users');

const { updateProfileValidate, validateGetUser } = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validateGetUser, getUser);
router.patch('/me', updateProfileValidate, updateProfile);
// router.patch('/me/avatar', avatarValidate, updateAvatar);
router.put('/:userId/roles', addRole);
router.delete('/:UserId/roles', removeRole);

module.exports = router;
