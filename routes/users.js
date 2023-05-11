const router = require('express').Router();

const { getUsers, getUserById, getCurrentUser, deleteUserById, updateUser, updateAvatar } = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get('/:userId', getUserById);

router.delete('/deleteUser/:userId', deleteUserById);

router.patch('/me', updateUser);

router.patch('/me/avatar', updateAvatar);

module.exports = router;