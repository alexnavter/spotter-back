import { Joi } from "express-validation";

const registerUserSchema = {
  body: Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().min(8).required(),
  }),
};

export default registerUserSchema;
