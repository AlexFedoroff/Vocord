const router = require('express').Router();
const {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
} = require('../controllers/roles');

// const { createRoleValidate, roleIdValidate } = require('../middlewares/validation');

router.get('/', getRoles);
router.get('/:roleId', getRole);
router.post('/', createRole);
router.delete('/:roleId', deleteRole);
router.patch('/', updateRole);

module.exports = router;
