const router = require('express').Router();
const {
  getRoles, createRole, updateRole,
} = require('../controllers/roles');

// const { createRoleValidate, roleIdValidate } = require('../middlewares/validation');

router.get('/', getRoles);
router.post('/', createRole);
// router.delete('/:cardId', cardIdValidate, deleteCard);
router.patch('/', updateRole);
// router.delete('/:cardId/likes', cardIdValidate, dislikeCard);

module.exports = router;
