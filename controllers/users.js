const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const UnauthorizedError = require('../errors/unauthorizedError');
// eslint-disable-next-line import/no-dynamic-require
const User = require(path.join('..', 'models', 'user'));
const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new BadRequestError('Данные пользователя введены не полностью');
    } else {
      return User.findUserByCredentials(email, password)
        .then((user) => {
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'super-puper-dev-secret', { expiresIn: '7d' },
          );
          res
            .cookie('jwt', token, {
              maxAge: 3600000 * 24 * 7,
              httpOnly: true,
              sameSite: true,
            })
            .send({ _id: user._id, message: 'Авторизация выполнена успешно' });
        })
        .catch(() => {
          next(new UnauthorizedError('Ошибка авторизации'));
        });
    }
  } catch (error) {
    next(error);
  }
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (!password || password.length < 8) {
    throw new BadRequestError('Пароль должен быть длиннее 8 символов');
  } else {
    bcrypt.hash(password, 10)
      .then((hash) => User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      }))
      .then((user) => res
        .send({
          data: {
            _id: user._id,
            name: user.name,
            avatar: user.avatar,
            email: user.email,
          },
          message: `Создан пользователь: ${name}`,
        }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new BadRequestError('Упс! Что-то не так...');
        } else {
          next(err);
        }
      })
      .catch(next);
  }
};

module.exports.getUsers = (req, res, next) => {
  User
    .find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      } else {
        res.send({ data: user });
      }
    })
    .catch(next);
};
