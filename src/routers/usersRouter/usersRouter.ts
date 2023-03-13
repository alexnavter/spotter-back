import { Router } from "express";
import { validate } from "express-validation";
import {
  loginUser,
  registerUser,
} from "../../server/controllers/usersControllers/usersControllers.js";
import loginUserSchema from "../../server/schemas/loginUserSchema.js";
import registerUserSchema from "../../server/schemas/registerUserSchema.js";

export const usersRouter = Router();

usersRouter.post(
  "/login",
  validate(loginUserSchema, {}, { abortEarly: false }),
  loginUser
);

usersRouter.post(
  "/register",
  validate(registerUserSchema, {}, { abortEarly: false }),
  registerUser
);
