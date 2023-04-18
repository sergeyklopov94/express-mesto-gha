const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { user } = req;

  Card.create({ name, link, owner: user._id })
    .then(card => card.populate('owner'))
    .then(card => res.send({ data: card }))
    .catch((err) => {
      next(err);
    });
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findByIdAndDelete(req.params.cardId)
    .populate('owner')
    .then(card => res.send({ data: card }))
    .catch((err) => {
      next(err);
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
  .populate('owner')
  .then(card => res.send({ data: card }))
  .catch((err) => {
    next(err);
  });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
  .populate('owner')
  .then(card => res.send({ data: card }))
  .catch((err) => {
    next(err);
  });
}