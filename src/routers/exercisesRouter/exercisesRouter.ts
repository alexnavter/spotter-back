import { Router } from "express";
import {
  getExercises,
  getUserExercises,
} from "../../server/controllers/exerciseControllers/exercisesControllers.js";

const exercisesRouter = Router();

const getExercisesRoute = "/";
const getUserExercisesRoute = "/my-exercises";

exercisesRouter.get(getExercisesRoute, getExercises);
exercisesRouter.get(getUserExercisesRoute, getUserExercises);

export default exercisesRouter;
