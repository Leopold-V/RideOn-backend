import Joi from 'joi';

const createDogSchema = Joi.object({
  species: Joi.string().alphanum().min(3).max(30).required(),
  dangerosity: Joi.number().min(1).max(10).required(),
  longitude: Joi.number().required(),
  latitude: Joi.number().required(),
  description: Joi.string().alphanum(),
});

const updateDogSchema = Joi.object({
  species: Joi.string().alphanum().min(3).max(30),
  dangerosity: Joi.number().min(1).max(10),
  longitude: Joi.number(),
  latitude: Joi.number(),
  description: Joi.string(),
});

export const createDogValidator = (dog) => {
  const { value, error } = createDogSchema.validate(dog);
  return { value, error };
};

export const updateDogValidator = (dog) => {
  const { value, error } = updateDogSchema.validate(dog);
  return { value, error };
};
