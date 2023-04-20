const mongoose = require('mongoose');
const Card = require('../models/card');
const { UNCORRECT_DATA, DATA_NOT_FOUND, DEFAULT_ERROR } = require('../utils/errorStatus');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(DEFAULT_ERROR)
      .send({ message: 'Что-то пошло не так' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { user } = req;

  Card.create({ name, link, owner: user._id })
    .then((card) => card.populate(['owner', 'likes']))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(UNCORRECT_DATA)
          .send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(DEFAULT_ERROR)
        .send({ message: 'Что-то пошло не так' });
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card === null) {
        return res.status(DATA_NOT_FOUND)
          .send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(UNCORRECT_DATA)
          .send({ message: 'Переданы некорректные данные для удаления карточки' });
      }
      return res.status(DEFAULT_ERROR)
        .send({ message: 'Что-то пошло не так' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card === null) {
        return res.status(DATA_NOT_FOUND)
          .send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(UNCORRECT_DATA)
          .send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
      return res.status(DEFAULT_ERROR)
        .send({ message: 'Что-то пошло не так' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card === null) {
        return res.status(DATA_NOT_FOUND)
          .send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(UNCORRECT_DATA)
          .send({ message: 'Переданы некорректные данные для cнятия лайка' });
      }
      return res.status(DEFAULT_ERROR)
        .send({ message: 'Что-то пошло не так' });
    });
};
