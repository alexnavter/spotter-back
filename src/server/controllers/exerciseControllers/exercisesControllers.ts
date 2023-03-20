import "../../../loadEnvironment.js";
import { type NextFunction, type Request, type Response } from "express";
import { CustomError } from "../../../CustomError/CustomError.js";

import {
  type CustomRequest,
  type ExerciseStructure,
} from "../../../types/types.js";
import mongoose from "mongoose";
import { Exercise } from "../../../database/models/Exercise.js";

export const getExercises = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const exercises = await Exercise.find().exec();

    res.status(200).json({ exercises });
  } catch (error) {
    const customError = new CustomError(
      "Bad request",
      400,
      "Couldn't retrieve exercises"
    );

    next(customError);
  }
};

export const getUserExercises = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const exercises = await Exercise.find({ createdBy: req.userId }).exec();

    res.status(200).json({ exercises });
  } catch (error) {
    const customError = new CustomError(
      "Bad request",
      400,
      "Could not retrieve exercises"
    );

    next(customError);
  }
};

export const deleteExercise = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { idExercise: exerciseId } = req.params;

  try {
    const exercise = await Exercise.findByIdAndDelete({
      _id: exerciseId,
      createdBy: req.userId,
    }).exec();

    res.status(200).json({ exercise });
  } catch (error) {
    const customError = new CustomError(
      "Something went wrong",
      500,
      "Could not delete the exercise"
    );

    next(customError);
  }
};

export const createExercise = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    type,
    equipment,
    difficulty,
    muscles,
    description,
    sets,
    reps,
    rest,
    duration,
    image,
  } = req.body as ExerciseStructure;
  const { userId } = req;
  try {
    const newExercise: ExerciseStructure = {
      name,
      type,
      equipment,
      difficulty,
      muscles,
      description,
      sets,
      reps,
      rest,
      duration,
      image,
      createdBy: new mongoose.Types.ObjectId(userId),
    };
    const createdExercise = await Exercise.create(newExercise);

    res.status(201).json({ exercise: createdExercise });
  } catch (error) {
    const customError = new CustomError(
      "An error ocurred at creating the exercise",
      400,
      "Could not create the exercise"
    );

    next(customError);
  }
};
