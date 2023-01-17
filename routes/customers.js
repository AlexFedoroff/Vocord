const router = require('express').Router();
const {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  addGroup,
  removeGroup,
} = require('../controllers/customers');

// const { createRoleValidate, roleIdValidate } = require('../middlewares/validation');

router.get('/', getCustomers);
router.get('/:customerId', getCustomer);
router.post('/', createCustomer);
router.delete('/:customerId', deleteCustomer);
router.patch('/', updateCustomer);
router.put('/:customerId/groups', addGroup);
router.delete('/:customerId/groups/:groupId', removeGroup);

module.exports = router;
