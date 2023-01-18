const router = require('express').Router();
const {
  getPermissions,
  getPermission,
  createPermission,
  updatePermission,
  deletePermission,
} = require('../controllers/permissions');

router.get('/', getPermissions);
router.get('/:permissionId', getPermission);
router.post('/', createPermission);
router.delete('/:groupId', deletePermission);
router.patch('/', updatePermission);

module.exports = router;
