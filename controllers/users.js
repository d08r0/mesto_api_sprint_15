const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.status(200).contentType('JSON').send({ data: user }))
    .catch(() => res.status(404).send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  console.log(password);
  console.log(email);

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(200).contentType('JSON').send({ data: user }))
    .catch(() => res.status(400).send({ message: 'переданы некорректные данные в метод создания пользователя' }));
};

module.exports.getUser = (req, res) => {
  User.find({})
    .then((users) => {
      const user = users.filter((item) => item._id.toString() === req.params.id);

      if (user.length === 0) {
        res.status(404);
        res.send({ error: 'Такого пользователя нет' });
        return;
      }

      res.status(200);
      res.contentType('JSON');
      res.send(user);
    })
    .catch(() => {
      res.status(500);
      res.contentType('JSON');
      res.send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.patchUsers = (req, res) => {
  const myId = req.user._id;
  User.findByIdAndUpdate(myId, req.body)
    .then((user) => {
      res.status(200);
      res.contentType('JSON');
      res.send({ data: user });
    })
    .catch(() => {
      res.status(400);
      res.contentType('JSON');
      res.send({ message: 'Произошла ошибка' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};
