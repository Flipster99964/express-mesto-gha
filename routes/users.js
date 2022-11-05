const routerUsers = require('express').Router();
const {
  getUserById, getUsers, createUser, patchUser,
  patchAvatar,
} = require('../controllers/users');

routerUsers.get('/', getUsers);
routerUsers.get('/:userId', getUserById);
routerUsers.post('/', createUser);
routerUsers.patch('/me', patchUser);
routerUsers.patch('/me/avatar', patchAvatar);
module.exports = routerUsers;
