const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.status(200).contentType('JSON').send({ data: card }))
    .catch(() => res.status(404).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).contentType('JSON').send({ data: card }))
    .catch(() => res.status(400).send({ message: 'Произошла ошибка' }));
};

module.exports.deleteCard = (req, res) => {
  const myId = req.user._id;

  if (req.params.cardId !== myId) {
    return res
      .status(403)
      .send({ message: 'У вас недостаточно прав' });
  }

  Card.findByIdAndDelete(req.params.cardId)
    .orFail()
    .then((card) => res.status(200).contentType('JSON').send({ data: card }))
    .catch(() => res.status(404).send({ message: 'Ресурс не найден' }));
};
