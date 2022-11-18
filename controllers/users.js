const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const ExistEmailError = require('../errors/exist-email-error');
const {
  ERROR_CODE_BAD_REQUEST,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_INTERNAL,
  SEKRET_KEY,
  ERROR_CODE_BAD_AUTH,
} = require('../constants');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SEKRET_KEY, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      next(new ERROR_CODE_BAD_AUTH('Неправильные почта или пароль.'));
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId).then((user) => {
    if (user) {
      res.status(200).send({
        data: user,
      });
    } else {
      res.status(ERROR_CODE_NOT_FOUND).send({
        message: 'Ошибка. Пользователь не найден, попробуйте еще раз',
      });
    }
  }).catch((err) => {
    if (err.name === 'CastError') {
      res.status(ERROR_CODE_BAD_REQUEST).send({
        message: 'Ошибка. Введен некорректный id пользователя',
      });
    } else {
      res.status(ERROR_CODE_INTERNAL).send({
        message: 'На сервере произошла ошибка',
      });
    }
  });
};
module.exports.getUsers = (req, res) => {
  User.find({}).then((users) => res.status(200).send({
    data: users,
  })).catch(() => res.status(ERROR_CODE_INTERNAL).send({
    message: 'На сервере произошла ошибка',
  }));
};
module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email, password,
  } = req.body;
  if (!email || !password) {
    return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Поля email и password обязательны' });
  }

  // хешируем пароль
  return bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, about, avatar, email: req.body.email, password: hash,
    }))
    .then((user) => {
      res.status(200).send({
        name: user.name, about: user.about, avatar: user.avatar, _id: user._id, email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      }
      if (err.code === 11000) {
        return (new ExistEmailError('Передан уже зарегистрированный email.'));
      }
      return res.status(ERROR_CODE_INTERNAL).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь по указанному _id не найден.'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => next(err));
};

module.exports.patchUser = (req, res) => {
  const {
    name,
    about,
  } = req.body;
  User.findByIdAndUpdate(req.user._id, {
    name,
    about,
  }, {
    new: true,
    runValidators: true,
  }).then((user) => {
    if (!user) {
      return res.status(ERROR_CODE_NOT_FOUND).send({
        message: 'Пользователь с указанным id не найден',
      });
    }
    return res.status(200).send({
      data: user,
    });
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(ERROR_CODE_BAD_REQUEST).send({
        message: 'Переданы некорректные данные при редактировании пользователя',
      });
    } else if (err.name === 'CastError') {
      res.status(ERROR_CODE_BAD_REQUEST).send({
        message: 'Передан некорректный id',
      });
    } else {
      res.status(ERROR_CODE_INTERNAL).send({
        message: 'На сервере произошла ошибка',
      });
    }
  });
};
module.exports.patchAvatar = (req, res) => {
  const {
    avatar,
  } = req.body;
  User.findByIdAndUpdate(req.user._id, {
    avatar,
  }, {
    new: true,
    runValidators: true,
  }).then((user) => {
    if (!user) {
      return res.status(ERROR_CODE_NOT_FOUND).send({
        message: 'Пользователь с указанным id не найден',
      });
    }
    return res.status(200).send({
      data: user,
    });
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(ERROR_CODE_BAD_REQUEST).send({
        message: 'Переданы некорректные данные при редактировании пользователя',
      });
    } else if (err.name === 'CastError') {
      res.status(ERROR_CODE_BAD_REQUEST).send({
        message: 'Передан некорректный id',
      });
    } else {
      res.status(ERROR_CODE_INTERNAL).send({
        message: 'На сервере произошла ошибка',
      });
    }
  });
};
