const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUser, patchUsers,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);

// usersRouter.get('/users/:id', getUser);

usersRouter.get('/users/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), getUser);

usersRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
  }).unknown(true),
}), patchUsers);

module.exports = usersRouter;
