const routerCards = require('express').Router();
const { getCards, createCard, deleteCard } = require('../controllers/card');

routerCards.get('/', getCards);
routerCards.post('/', createCard);
routerCards.get('/:cardId', deleteCard);

module.exports = routerCards;