const resourceRouter = require('express').Router();
const NotFoundError = require('../errors/notFoundError');

resourceRouter.all('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = resourceRouter;
