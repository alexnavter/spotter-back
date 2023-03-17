import { Router } from "express";
import multer from "multer";
import {
  createExercise,
  deleteExercise,
  getExercises,
  getUserExercises,
} from "../../server/controllers/exerciseControllers/exercisesControllers.js";
import auth from "../../server/middlewares/auth/auth.js";
import path from "path";

const exercisesRouter = Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename(req, file, callback) {
    const suffix = crypto.randomUUID();
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);
    const filename = `${basename}-${suffix}${extension}`;

    callback(null, filename);
  },
});

const upload = multer({ storage });

const getExercisesRoute = "/";
const getUserExercisesRoute = "/my-exercises";
const deleteExerciseRoute = "/delete/:idExercise";
const createExerciseRoute = "/create-exercise";

exercisesRouter.get(getExercisesRoute, getExercises);
exercisesRouter.get(getUserExercisesRoute, auth, getUserExercises);
exercisesRouter.delete(deleteExerciseRoute, auth, deleteExercise);
exercisesRouter.post(
  createExerciseRoute,
  auth,
  upload.single("image"),
  createExercise
);

export default exercisesRouter;
