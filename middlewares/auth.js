const jwt = require('jsonwebtoken');
const { SEKRET_KEY, ERROR_CODE_BAD_AUTH } = require('../constants');

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;
  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    // return res
    //   .status(401)
    //   .send({ message: 'Необходима авторизация' });
    return next(new ERROR_CODE_BAD_AUTH('Необходима авторизация.'));
  }
  // извлечём токен
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, SEKRET_KEY);
  } catch (err) {
    return next(new ERROR_CODE_BAD_AUTH('Необходима авторизация.'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
