const router = require('express').Router();
const {
  getNotifications,
  getNotification,
  createNotification,
  updateNotification,
  deleteNotification,
  addGroup,
  removeGroup,
  addCustomer,
  removeCustomer,
} = require('../controllers/notifications');

router.get('/', getNotifications);
router.get('/:notificationId', getNotification);
router.post('/', createNotification);
router.delete('/:notificationId', deleteNotification);
router.patch('/', updateNotification);
router.put('/:notificationId/groups', addGroup);
router.delete('/:notificationId/groups/:groupId', removeGroup);
router.put('/:notificationId/customers', addCustomer);
router.delete('/:notificationId/customers/:customerId', removeCustomer);

module.exports = router;
