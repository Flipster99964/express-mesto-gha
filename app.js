const express = require('express');
const mongoose = require('mongoose');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/card');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/mestodb');
app.use((req, res, next) => {
  req.user = {
    _id: '6361330e7fb5e960cb101f85' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});
app.use(express.json());
app.use('/users', routerUsers);
app.use('/cards', routerCards);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`); // Если всё работает, консоль покажет, какой порт приложение слушает
});