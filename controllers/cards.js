const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  //console.log(req.user._id);
  const { name, link } = req.body;
  const { user } = req;

  Card.create({ name, link, owner: user._id })
    .then(card => res.send({ data: card }))
    .catch((err) => {
      next(err);
    });
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then(card => res.send({ data: card }))
    .catch((err) => {
      next(err);
    });
};
