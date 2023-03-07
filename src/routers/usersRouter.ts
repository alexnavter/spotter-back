import { Router } from "express";
import { loginUser } from "../server/controllers/userControllers.js";

export const usersRouter = Router();

usersRouter.post("/login", loginUser);
