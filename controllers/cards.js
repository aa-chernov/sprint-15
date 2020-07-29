const path = require('path');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');
// eslint-disable-next-line import/no-dynamic-require
const Card = require(path.join('..', 'models', 'card'));

module.exports.getCards = (req, res, next) => {
  Card
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res
      .send({ data: card, message: `Создана карточка: ${name}` }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Упс! Что-то не так...');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет такой карточки');
      } else if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Вы не можете удалить эту карточку');
      } else {
        return Card.findByIdAndRemove(req.params._id)
          .then((cardForDel) => {
            res.send({ message: `Удалена карточка ${cardForDel.name} с id ${cardForDel._id}` });
          })
          .catch(next);
      }
    })
    .catch(next);
};
