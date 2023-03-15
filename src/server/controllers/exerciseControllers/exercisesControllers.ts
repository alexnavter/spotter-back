import { type NextFunction, type Request, type Response } from "express";
import { CustomError } from "../../../CustomError/CustomError.js";
import Exercise from "../../../database/models/Exercise.js";
import { type CustomUserRequest } from "../../../types/types.js";

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
  req: CustomUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const exercises = await Exercise.find({ createdBy: req.createdBy }).exec();

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
