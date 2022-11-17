const routerUsers = require('express').Router();
const {
  getUserById, getUsers, createUser, patchUser,
  patchAvatar, login,
} = require('../controllers/users');

routerUsers.get('/users', getUsers);
routerUsers.get('/users/:userId', getUserById);
routerUsers.post('/signup', createUser);
routerUsers.post('/signin', login);
routerUsers.patch('/users/me', patchUser);
routerUsers.patch('/users/me/avatar', patchAvatar);

module.exports = routerUsers;
