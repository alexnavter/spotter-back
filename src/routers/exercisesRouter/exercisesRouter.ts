import { Router } from "express";
import {
  deleteExercise,
  getExercises,
  getUserExercises,
} from "../../server/controllers/exerciseControllers/exercisesControllers.js";
import auth from "../../server/middlewares/auth/auth.js";

const exercisesRouter = Router();

const getExercisesRoute = "/";
const getUserExercisesRoute = "/my-exercises";
const deleteExerciseRoute = "/delete/:idExercise";

exercisesRouter.get(getExercisesRoute, getExercises);
exercisesRouter.get(getUserExercisesRoute, auth, getUserExercises);
exercisesRouter.delete(deleteExerciseRoute, auth, deleteExercise);

export default exercisesRouter;
