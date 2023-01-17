const router = require('express').Router();
const {
  getCustomerGroups,
  getCustomerGroup,
  createCustomerGroup,
  updateCustomerGroup,
  deleteCustomerGroup,
} = require('../controllers/customerGroups');

// const { createRoleValidate, roleIdValidate } = require('../middlewares/validation');

router.get('/', getCustomerGroups);
router.get('/:groupId', getCustomerGroup);
router.post('/', createCustomerGroup);
router.delete('/:groupId', deleteCustomerGroup);
router.patch('/', updateCustomerGroup);

module.exports = router;
