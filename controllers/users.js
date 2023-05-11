const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { CREATED, UNCORRECT_DATA, UNAUTHORIZED, DATA_NOT_FOUND, DEFAULT_ERROR } = require('../utils/errorStatus');

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

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then(user => res.send({ data: user }))
    .catch((err) => {
      return res.status(DEFAULT_ERROR)
      .send({ message: "Что-то пошло не так" })
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if(err.code === 11000) {
        return res.status(CREATED)
        .send({ message: "Пользователь уже существует" })
      }
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

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id},
        'secret-key',
        {expiresIn: '7d'});
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: true
      })
      res.send({ token });
    })
    .catch((err) => {
      if(err.status === 401) {
        return res.status(UNAUTHORIZED)
        .send({ message: "Неверное имя пользователя или пароль" })
      } else {
        return res.status(DEFAULT_ERROR)
        .send({ message: "Что-то пошло не так" })
      }
    });
};

module.exports.deleteUserById = (req, res) => {
  User.findByIdAndDelete(req.params.userId)
    .then(user => res.send({ data: user }))
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