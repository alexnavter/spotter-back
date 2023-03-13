import { Router } from "express";
import { getExercises } from "../../server/controllers/exerciseControllers/exercisesControllers.js";

const exercisesRouter = Router();

exercisesRouter.get("/", getExercises);

export default exercisesRouter;
