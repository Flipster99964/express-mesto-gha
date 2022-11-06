const Card = require('../models/card');
const {
  ERROR_CODE_BAD_REQUEST,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_INTERNAL,
} = require('../constants');

module.exports.getCards = (req, res) => {
  Card.find({}).then((cards) => res.status(200).send({
    data: cards,
  })).catch(() => res.status(ERROR_CODE_INTERNAL).send({
    message: 'На сервере произошла ошибка',
  }));
};
module.exports.createCard = (req, res) => {
  const {
    name,
    link,
  } = req.body;
  const owner = req.user._id;
  Card.create({
    name,
    link,
    owner,
  }).then((card) => {
    res.send({
      card,
    });
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(ERROR_CODE_BAD_REQUEST).send({
        message: 'Переданы некорректные данные при создании карточки',
      });
    } else {
      res.status(ERROR_CODE_INTERNAL).send({
        message: 'На сервере произошла ошибка',
      });
    }
  });
};
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId).then((cards) => {
    if (!cards) {
      res.status(ERROR_CODE_NOT_FOUND).send({
        message: 'Карточка с указанным _id не найдена.',
      });
    } else {
      res.send({
        data: cards,
      });
    }
  }).catch((err) => {
    if (err.name === 'CastError') {
      return res.status(ERROR_CODE_BAD_REQUEST).send({
        message: 'Передан некорректный _id карточки.',
      });
    }
    return res.status(ERROR_CODE_INTERNAL).send({
      message: 'На сервере произошла ошибка',
    });
  });
};
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, {
    $addToSet: {
      likes: req.user._id,
    },
  }, {
    new: true,
  }).then((cards) => {
    if (!cards) {
      // отправить ошибку 404
      return res.status(ERROR_CODE_NOT_FOUND).send({
        message: 'Передан несуществующий _id карточки.',
      });
    }
    return res.status(200).send({
      data: cards,
    });
  }).catch((err) => {
    if (err.name === 'CastError') {
      return res.status(ERROR_CODE_BAD_REQUEST).send({
        message: 'Передан некорректный _id карточки.',
      });
    }
    return res.status(ERROR_CODE_INTERNAL).send({
      message: 'На сервере произошла ошибка',
    });
  });
};
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, {
    $pull: {
      likes: req.user._id,
    },
  }, {
    new: true,
  }).then((cards) => {
    if (!cards) {
      // отправить ошибку 404
      return res.status(ERROR_CODE_NOT_FOUND).send({
        message: 'Передан несуществующий _id карточки.',
      });
    }
    return res.status(200).send({
      data: cards,
    });
  }).catch((err) => {
    if (err.name === 'CastError') {
      return res.status(ERROR_CODE_BAD_REQUEST).send({
        message: 'Передан некорректный _id карточки.',
      });
    }
    return res.status(ERROR_CODE_INTERNAL).send({
      message: 'На сервере произошла ошибка',
    });
  });
};
