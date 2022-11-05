const User = require('../models/user');

const {
  ERROR_CODE_BAD_REQUEST,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_INTERNAL,
} = require('../constants');

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
  .then((user) => {
    if (user) {
      res.status(200).send({ data: user });
    } else {
      res.status(ERROR_CODE_NOT_FOUND).send({ data: 'Ошибка. Пользователь не найден, попробуйте еще раз' });
    }
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(ERROR_CODE_BAD_REQUEST).send({ data: 'Ошибка. Введен некорректный id пользователя' });
    } else {
      res.status(ERROR_CODE_INTERNAL).send({ data: 'На сервере произошла ошибка' });
    }
  });
    };

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(ERROR_CODE_INTERNAL).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
  .then((users) => {
    res.status(200).send({ data: users });
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
    } else if (err.statusCode === ERROR_CODE_NOT_FOUND) {
      res.status(ERROR_CODE_NOT_FOUND).send({ message: err.message });
    } else {
      res.status(ERROR_CODE_INTERNAL).send({ message: 'На сервере произошла ошибка' });
    }
  });
};

module.exports.patchUser = (req, res) => {
  const { name, about } = req.body;
  const userID = req.user._id;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь с указанным id не найден' });
     }
     return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
      res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при редактировании пользователя' });
      } else if (err.name === 'CastError') {
      res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Пользователь с указанным id не найден' });
     }
      res.status(ERROR_CODE_INTERNAL).send({ message: 'На сервере произошла ошибка' });
    });
};
module.exports.patchAvatar = (req, res) => {
  const { name, avatar } = req.body;
  const userID = req.user._id;

  User.findByIdAndUpdate(req.user._id, { name, avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь с указанным id не найден' });
    }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при редактировании пользователя' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Пользователь по указанному _id не найден.' });
    }
    res.status(ERROR_CODE_INTERNAL).send({ message: 'На сервере произошла ошибка' });
    });
};