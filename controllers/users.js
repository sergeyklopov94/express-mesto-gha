const User = require('../models/user');

const { UNCORRECT_DATA, DATA_NOT_FOUND, DEFAULT_ERROR } = require('../utils/errorStatus');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      return res.status(DEFAULT_ERROR)
      .send({ message: "Что-то пошло не так" })
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if(err.name === 'CastError') {
        return res.status(DATA_NOT_FOUND)
        .send({ message: "Пользователь по указанному _id не найден" })
      } else {
        return res.status(DEFAULT_ERROR)
        .send({ message: "Что-то пошло не так" })
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if(err.name === 'ValidationError') {
        return res.status(UNCORRECT_DATA)
        .send({ message: "Переданы некорректные данные при создании пользователя" })
      } else {
        return res.status(DEFAULT_ERROR)
        .send({ message: "Что-то пошло не так" })
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user, { name, about },
    {
      new: true,
      runValidators: true
    })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if(err.name === 'ValidationError') {
        return res.status(UNCORRECT_DATA)
        .send({ message: "Переданы некорректные данные при обновлении профиля" })
      } else {
        return res.status(DEFAULT_ERROR)
        .send({ message: "Что-то пошло не так" })
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user, { avatar },
    {
      new: true,
      runValidators: true
    })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if(err.name === 'ValidationError') {
        return res.status(UNCORRECT_DATA)
        .send({ message: "Переданы некорректные данные при обновлении аватара" })
      } else {
        return res.status(DEFAULT_ERROR)
        .send({ message: "Что-то пошло не так" })
      }
    });
};