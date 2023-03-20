import { Joi } from "express-validation";

export const exercisesSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
    equipment: Joi.string().required(),
    difficulty: Joi.string().required(),
    muscles: Joi.string().required(),
    description: Joi.string(),
    sets: Joi.string(),
    reps: Joi.string(),
    rest: Joi.string(),
    duration: Joi.string(),
    image: Joi.string(),
  }),
};
