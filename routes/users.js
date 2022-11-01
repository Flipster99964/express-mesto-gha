const routerUsers = require('express').Router();
const {
  getUser, getUsers, createUser
} = require('../controllers/users');

routerUsers.get('/', getUsers);
routerUsers.get('/:userId', getUser);
routerUsers.post('/', createUser);

module.exports = routerUsers;