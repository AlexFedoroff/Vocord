const router = require('express').Router();
const {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  addPermission,
  removePermission,
} = require('../controllers/roles');

// const { createRoleValidate, roleIdValidate } = require('../middlewares/validation');

router.get('/', getRoles);
router.get('/:roleId', getRole);
router.post('/', createRole);
router.delete('/:roleId', deleteRole);
router.patch('/', updateRole);
router.put('/:roleId/permissions', addPermission);
router.delete('/:roleId/permissions/:permissionId', removePermission);

module.exports = router;
