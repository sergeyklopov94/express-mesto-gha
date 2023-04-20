const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { DATA_NOT_FOUND } = require('./utils/errorStatus');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '643e6c36ef16d7fefe120ed9',
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((req, res) => {
  res.status(DATA_NOT_FOUND).send({ message: 'Некорректный запрос' });
});

app.listen(PORT, () => {
  console.log('сервер запущен корректно');
});
