const jwt = require('jsonwebtoken');
const User = require('../models/user');

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
  } = req.body;
  User.create({
    name,
    about,
    avatar,
  }).then((users) => {
    res.status(200).send({
      data: users,
    });
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(ERROR_CODE_BAD_REQUEST).send({
        message: 'Переданы некорректные данные при создании пользователя',
      });
    } else {
      res.status(ERROR_CODE_INTERNAL).send({
        message: 'На сервере произошла ошибка',
      });
    }
  });
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
