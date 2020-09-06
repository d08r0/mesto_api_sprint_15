const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.status(200).contentType('JSON').send({ data: card }))
    .catch(() => {
      throw new NotFoundError('Произошла ошибка');
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).contentType('JSON').send({ data: card }))
    .catch(() => {
      throw new NotFoundError('Произошла ошибка');
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
        // return res
        // .status(403);
        // .send({ message: 'У вас недостаточно прав' });
        throw new NotFoundError('Произошла ошибка');
      }
    })
    .catch(next);

  Card.findByIdAndDelete(cardId)
    .orFail()
    .then((card) => res.status(200).contentType('JSON').send({ data: card }))
    .catch(() => res.status(404).send({ message: 'Ресурс не найден' }));
};
