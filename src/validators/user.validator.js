import Joi from 'joi';

const createUserSchema = Joi.object({
  firstname: Joi.string().alphanum().min(3).max(30).required(),
  lastname: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(7).max(255).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  friendslist: Joi.array().items(Joi.string),
  isOnline: Joi.boolean(),
});

const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(7).max(255).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

export const createUserValidator = (user) => {
  const { value, error } = createUserSchema.validate(user);
  return { value, error };
};

export const loginUserValidator = (email, password) => {
  const { value, error } = loginUserSchema.validate({ email, password });
  return { value, error };
};
