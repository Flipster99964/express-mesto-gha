const card = require('../models/card');
const {
  ERROR_CODE_BAD_REQUEST,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_INTERNAL,
} = require('../constants');

module.exports.getCards = (req, res) => {
  card.find({})
    .then((cards) => res.status(200).send({ data: cards })
    )
    .catch(() => res.status(ERROR_CODE_INTERNAL).send({ message: 'На сервере произошла ошибка' })
    );
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  card.create({ name, link, owner })
  .then((card) => res.status(200).send({
    name: card.name,
    link: card.link,
  }))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
    } else {
      res.status(ERROR_CODE_INTERNAL).send({ message: 'На сервере произошла ошибка' });
    }
  });
};

module.exports.deleteCard = (req, res) => {
  card.findByIdAndRemove(req.params.cardId)
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: err.message });
      }
      return res.status(ERROR_CODE_INTERNAL).send({ message: 'На сервере произошла ошибка' });
    });
};
module.exports.likeCard = (req, res) => {
  сard.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((cards) => {
      res.status(200).send({ data: cards });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: err.message });
      } else {
        res.status(ERROR_CODE_INTERNAL).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Сard.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((cards) => {
      res.status(200).send({ data: cards });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: err.message });
      } else {
        res.status(ERROR_CODE_INTERNAL).send({ message: 'На сервере произошла ошибка' });
      }
    });
};