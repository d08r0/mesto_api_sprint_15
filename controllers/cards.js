const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const BadRequestError = require('../errors/bad-request-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.status(200).contentType('JSON').send({ data: card }))
    .catch(() => {
      throw new BadRequestError('Произошла ошибка');
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).contentType('JSON').send({ data: card }))
    .catch(() => {
      throw new BadRequestError('Произошла ошибка');
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const myId = req.user._id;
  const { cardId } = req.params;

  Card.findById(cardId)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      const owner = card.owner._id.toString();

      if (owner !== myId) {
        throw new ForbiddenError('У вас недостаточно прав');
      }

      Card.findByIdAndDelete(cardId)
        .orFail()
        .then((card2) => res.status(200).contentType('JSON').send({ data: card2 }))
        .catch(() => {
          throw new NotFoundError('Ресурс не найден');
        })
        .catch(next);
    })
    .catch(next);
};
