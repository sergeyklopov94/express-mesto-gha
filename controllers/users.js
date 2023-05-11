const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const DataNotFoundError = require('../errors/data-not-found-err');
const UncorrectDataError = require('../errors/uncorrect-data-err');
const UnauthorizedError = require('../errors/unauthorized-err');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new DataNotFoundError('Пользователь по указанному _id не найден');
      }
      res.send({ data: user })
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then(user => res.send({ data: user }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
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
      if (err.code === 11000) {
        next(new UnauthorizedError('Пользователь уже существует'));
      }
      if (err.name === 'ValidationError') {
        next(new UncorrectDataError('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user, { name, about },
    {
      new: true,
      runValidators: true
    })
    .then((user) => {
      if (!user) {
        throw new DataNotFoundError('Такого пользователя не существует');
      }
      res.send({ data: user })
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new UncorrectDataError('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user, { avatar },
    {
      new: true,
      runValidators: true
    })
    .then((user) => {
      if (!user) {
        throw new UncorrectDataError('Такого пользователя не существует');
      }
      res.send({ data: user })
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new UncorrectDataError('Переданы некорректные данные при обновлении аватара'));
      } else {
       next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
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
    .catch(next);
    //   (err) => {
    //   if(err.status === 401) {
    //     return res.status(UNAUTHORIZED)
    //     .send({ message: "Неверное имя пользователя или пароль" })
    //   } else {
    //     next(err);
    //   }
    // });
};

// module.exports.deleteUserById = (req, res) => {
//   User.findByIdAndDelete(req.params.userId)
//     .then(user => res.send({ data: user }))
//     .catch((err) => {
//       if(err.name === 'CastError') {
//         return res.status(DATA_NOT_FOUND)
//         .send({ message: "Карточка с указанным _id не найдена" })
//       } else {
//         return res.status(DEFAULT_ERROR)
//         .send({ message: "Что-то пошло не так" })
//       }
//     });
// };