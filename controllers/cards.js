const Card = require('../models/card');

const UncorrectDataError = require('../errors/uncorrect-data-err');
const DataNotFoundError = require('../errors/data-not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => card.populate('owner'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new UncorrectDataError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new DataNotFoundError('Такой карточки не существует');
      } else if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Запрещено удаление карточки другого пользователя');
      }
      Card.findByIdAndDelete(req.params.cardId)
        .populate('owner')
        .then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new DataNotFoundError('Карточка с указанным _id не найдена'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new DataNotFoundError('Карточка не существует');
      }
      // eslint-disable-next-line max-len
      Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
        .populate('owner')
        .then((cardLike) => res.send({ data: cardLike }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new DataNotFoundError('Передан несуществующий _id карточки'));
      } else if (err.name === 'ValidationError') {
        next(new UncorrectDataError('Переданы некорректные данные для постановки лайка'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new DataNotFoundError('Карточка не существует');
      }
      Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
        .populate('owner')
        .then((cardDislike) => res.send({ data: cardDislike }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new DataNotFoundError('Передан несуществующий _id карточки'));
      } else if (err.name === 'ValidationError') {
        next(new UncorrectDataError('Переданы некорректные данные для снятия лайка'));
      } else {
        next(err);
      }
    });
};
