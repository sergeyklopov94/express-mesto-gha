const Card = require('../models/card');

const { UNCORRECT_DATA, DATA_NOT_FOUND, DEFAULT_ERROR } = require('../utils/errorStatus');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      return res.status(DEFAULT_ERROR)
      .send({ message: "Что-то пошло не так" })
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then(card => card.populate('owner'))
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if(err.name === 'ValidationError') {
        return res.status(UNCORRECT_DATA)
        .send({ message: "Переданы некорректные данные при создании карточки" })
      } else {
        return res.status(DEFAULT_ERROR)
        .send({ message: "Что-то пошло не так" })
      }
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      console.log(card.owner.toString());
      console.log(req.user._id);
      if (card.owner.toString() !== req.user._id) {
        console.log('req.user._id');
        throw new Error('Запрещено удаление карточки другого пользователя');
      }
      Card.findByIdAndDelete(req.params.cardId)
        .populate('owner')
        .then(() => res.send({ message: 'Карточка удалена' }))
    })
    .catch((err) => {
      if(err.name === 'CastError') {
        return res.status(DATA_NOT_FOUND)
        .send({ message: "Карточка с указанным _id не найдена" })
      } else {
        return res.status(DEFAULT_ERROR)
        .send({ message: "Что-то пошло не так" })
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
  .populate('owner')
  .then(card => res.send({ data: card }))
  .catch((err) => {
    if(err.name === 'CastError') {
      return res.status(DATA_NOT_FOUND)
      .send({ message: "Передан несуществующий _id карточки" })
    } else if(err.name === 'ValidationError') {
      return res.status(UNCORRECT_DATA)
        .send({ message: "Переданы некорректные данные для постановки лайка" })
    } else {
      return res.status(DEFAULT_ERROR)
      .send({ message: "Что-то пошло не так" })
    }
  });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
  .populate('owner')
  .then(card => res.send({ data: card }))
  .catch((err) => {
    if(err.name === 'CastError') {
      return res.status(DATA_NOT_FOUND)
      .send({ message: "Передан несуществующий _id карточки" })
    } else if(err.name === 'ValidationError') {
      return res.status(UNCORRECT_DATA)
        .send({ message: "Переданы некорректные данные для снятия лайка" })
    } else {
      return res.status(DEFAULT_ERROR)
      .send({ message: "Что-то пошло не так" })
    }
  });
}