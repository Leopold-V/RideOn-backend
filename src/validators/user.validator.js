import Joi from 'joi';

const userSchema = Joi.object({
    firstname: Joi.string().alphanum().min(3).max(30).required(),
    lastname: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    friendslist: Joi.array().items(Joi.string),
    isOnline: Joi.boolean(),
});

export const createUserValidator = (user) => {
    const { value, error } = userSchema.validate(user);
    return { value, error };
}
