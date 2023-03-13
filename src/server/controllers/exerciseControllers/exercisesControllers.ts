import { type NextFunction, type Request, type Response } from "express";
import { CustomError } from "../../../CustomError/CustomError";
import Exercise from "../../../database/models/Exercise";

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
