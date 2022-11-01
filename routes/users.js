const routerUsers = require('express').Router();
const {
  getUser, getUsers, createUser, patchUser,
  patchAvatar,
} = require('../controllers/users');

routerUsers.get('/', getUsers);
routerUsers.get('/:userId', getUser);
routerUsers.post('/', createUser);
routerUsers.patch('/me', patchUser);
routerUsers.patch('/me/avatar', patchAvatar);
module.exports = routerUsers;