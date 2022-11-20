const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ExistEmailError = require('../errors/exist-email-error');
const BadAuthError = require('../errors/bad-auth-error');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const {
  SEKRET_KEY,
} = require('../constants');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SEKRET_KEY, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      next(new BadAuthError('Неправильные почта или пароль.'));
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден, попробуйте еще раз');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Введен некорректный id пользователя'));
      }
      return next(err);
    });
};
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((result) => res.send(result))
    .catch(next);
};
module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
  } = req.body;

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
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      if (err.code === 11000) {
        return next(new ExistEmailError('Передан уже зарегистрированный email.'));
      }
      return next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.find({ _id })
    .then((user) => res.status(200).send({ data: user[0] }))
    .catch(next);
};

module.exports.patchUser = (req, res, next) => {
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
      return next(new NotFoundError('Пользователь по указанному _id не найден.'));
    }
    return res.send({ data: user });
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные при обновлении пользователя'));
    }
    return next(err);
  });
};
module.exports.patchAvatar = (req, res, next) => {
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
      return next(new NotFoundError('Пользователь по указанному _id не найден.'));
    }
    return res.send({ data: user });
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные при обновлении пользователя'));
    }
    return next(err);
  });
};
