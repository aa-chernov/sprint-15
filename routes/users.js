const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const auth = require('../middlewares/auth');
const BadRequestError = require('../errors/badRequestError');
const {
  getUserById,
  getUsers,
  createUser,
  login,
} = require('../controllers/users');

usersRouter
  .post('/signin', celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }), login)
  .post('/signup', celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
      avatar: Joi.string()
        .required()
        .custom((url) => {
          if (!validator.isURL(url)) {
            throw new BadRequestError('Введите URL-ссылку');
          }
          return url;
        }),
    }),
  }), createUser);
usersRouter
  .get('/users', auth, getUsers)
  .get('/users/:_id', auth,
    celebrate({
      params: Joi.object().keys({
        _id: Joi.string().length(24).hex(),
      }),
    }), getUserById);

module.exports = usersRouter;
