const router = require('express').Router();

const { getUsers, getUserById, deleteUserById, updateUser, updateAvatar } = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', getUserById);

router.delete('/deleteUser/:userId', deleteUserById);

router.patch('/me', updateUser);

router.patch('/me/avatar', updateAvatar);

module.exports = router;