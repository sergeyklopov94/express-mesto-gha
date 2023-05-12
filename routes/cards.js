const router = require('express').Router();
const { createCardValidation, cardIdValidation } = require('../middlewares/cardValidation');

const {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', createCardValidation, createCard);

router.delete('/:cardId', deleteCardById);

router.put('/:cardId/likes', cardIdValidation, likeCard);

router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
