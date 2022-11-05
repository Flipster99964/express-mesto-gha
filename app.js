const express = require('express');
const mongoose = require('mongoose');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/card');
const {
  ERROR_CODE_NOT_FOUND,
} = require('./constants');
const app = express();
const PORT = 3000;


async function main() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mestodb');
  } catch (error) {
    console.log(error);
  }
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}

app.use((req, res, next) => {
  req.user = { // это _id созданного пользователя 'Тест'
    _id: '6361330e7fb5e960cb101f85',
  };
  next();
});
app.use(express.json());
app.use('/users', routerUsers);
app.use('/cards', routerCards);
// Обработка несущ. страницы
app.use('*', (req, res) => {
  res.status(ERROR_CODE_NOT_FOUND).send({ message: `Страницы по адресу ${req.baseUrl} не существует` });
});
main();