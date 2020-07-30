const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const auth = require('../middlewares/auth');
const BadRequestError = require('../errors/badRequestError');
const { getCards, createCard, deleteCard } = require('../controllers/cards');

cardsRouter.route('/cards')
  .get(auth, getCards)
  .post(auth, celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().custom((value) => {
        if (!validator.isURL(value)) {
          throw new BadRequestError('Введите URL-ссылку');
        }
        return value;
      }),
    }),
  }), createCard);
cardsRouter.deleteCard('/cards/:_id', auth,
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex(),
    }),
  }), deleteCard);

module.exports = cardsRouter;
