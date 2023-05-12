const router = require('express').Router();
const { userIdValidation, updateUserValidation, updateAvatarValidation } = require('../middlewares/userValidation');

const {
  getUsers, getUserById, getCurrentUser, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get('/:userId', userIdValidation, getUserById);

router.patch('/me', updateUserValidation, updateUser);

router.patch('/me/avatar', updateAvatarValidation, updateAvatar);

module.exports = router;
