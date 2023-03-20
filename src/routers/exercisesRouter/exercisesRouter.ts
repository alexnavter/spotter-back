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
import supaBase from "../../server/middlewares/supabase/supabase.js";
import { validate } from "express-validation";
import { exercisesSchema } from "../../server/schemas/exerciseSchema/exercisesSchema.js";
import crypto from "crypto";

const exercisesRouter = Router();

const configMulter = {
  storage: multer.diskStorage({
    destination: "uploads/",
    filename(req, file, callback) {
      const suffix = crypto.randomUUID();
      const extension = path.extname(file.originalname);
      const basename = path.basename(file.originalname, extension);
      const filename = `${basename}-${suffix}${extension}`;
      callback(null, filename);
    },
  }),
};

const upload = multer({ ...configMulter, limits: { fileSize: 100000000 } });

const getExercisesRoute = "/";
const getUserExercisesRoute = "/my-exercises";
const deleteExerciseRoute = "/delete/:idExercise";
const createExerciseRoute = "/create";

exercisesRouter.get(getExercisesRoute, getExercises);

exercisesRouter.get(getUserExercisesRoute, auth, getUserExercises);
exercisesRouter.delete(deleteExerciseRoute, auth, deleteExercise);
exercisesRouter.post(
  createExerciseRoute,
  auth,
  upload.single("image"),
  validate(exercisesSchema, {}, { abortEarly: false }),
  supaBase,
  createExercise
);

export default exercisesRouter;
