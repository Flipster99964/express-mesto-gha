const express = require('express');
const mongoose = require('mongoose');
const BodyParser = require('body-parser');
const { errors } = require('celebrate');
const routes = require('./routes/routes');
const cenralErrors = require('./middlewares/central-error');

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
app.use(BodyParser.json());
app.use(express.json());
app.use(routes);

app.use(errors());
app.use(cenralErrors);

main();
