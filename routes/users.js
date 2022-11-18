const express = require('express');
const routerUsers = require('express').Router();
const {
  getUserById, getUsers, createUser, patchUser,
  patchAvatar, login, getCurrentUser,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

const app = express();

routerUsers.post('/signup', createUser);
routerUsers.post('/signin', login);

app.use(auth);

routerUsers.get('/users', getUsers);
routerUsers.get('/users/:userId', getUserById);
routerUsers.get('/users/me', getCurrentUser);
routerUsers.patch('/users/me', patchUser);
routerUsers.patch('/users/me/avatar', patchAvatar);

module.exports = routerUsers;
