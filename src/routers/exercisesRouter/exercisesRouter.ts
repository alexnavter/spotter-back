import { Router } from "express";
import {
  getExercises,
  getUserExercises,
} from "../../server/controllers/exerciseControllers/exercisesControllers.js";
import auth from "../../server/middlewares/auth/auth.js";

const exercisesRouter = Router();

const getExercisesRoute = "/";
const getUserExercisesRoute = "/my-exercises";

exercisesRouter.get(getExercisesRoute, getExercises);
exercisesRouter.get(getUserExercisesRoute, auth, getUserExercises);

export default exercisesRouter;
