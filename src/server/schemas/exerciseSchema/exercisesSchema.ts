import { Joi } from "express-validation";

export const exercisesSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
    equipment: Joi.string().required(),
    difficulty: Joi.number().required(),
    muscles: Joi.string().required(),
    description: Joi.string().required(),
    sets: Joi.number(),
    reps: Joi.number(),
    rest: Joi.number(),
    duration: Joi.number(),
    image: Joi.string().required(),
  }),
};
