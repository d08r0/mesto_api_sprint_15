const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.status(200).contentType('JSON').send({ data: user }))
    .catch(() => {
      throw new BadRequestError('Произошла ошибка');
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then(() => res.status(200).contentType('JSON').send({
      name, about, avatar, email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        throw new ConflictError('Пароль занят');
      }

      throw new BadRequestError('Произошла ошибка');
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((users) => {
      const user = users.filter((item) => item._id.toString() === req.params.id);

      if (user.length === 0) {
        throw new NotFoundError('Такого пользователя нет');
      }
      res.status(200);
      res.contentType('JSON');
      res.send(user);
    })
    .catch(next);
};

module.exports.patchUsers = (req, res, next) => {
  const myId = req.user._id;
  User.findByIdAndUpdate(myId, req.body)
    .then((user) => {
      res.status(200);
      res.contentType('JSON');
      res.send({ data: user });
    })
    .catch(() => {
      throw new BadRequestError('Произошла ошибка');
    })
    .catch(next);
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
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
