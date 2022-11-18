const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
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
app.use(express.json());
app.use(routes);
// Обработка несущ. страницы
app.use('*', (req, res) => {
  res.status(ERROR_CODE_NOT_FOUND).send({
    message: `Страницы по адресу ${req.baseUrl} не существует`,
  });
});
main();
