import { createClient } from "@supabase/supabase-js";
import { type NextFunction, type Request, type Response } from "express";
import { CustomError } from "../../../CustomError/CustomError.js";
import Exercise from "../../../database/models/Exercise.js";
import {
  type CustomCreateExerciseRequest,
  type CustomUserRequest,
} from "../../../types/types.js";
import fs from "fs/promises";
import path from "path";

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

export const deleteExercise = async (
  req: CustomUserRequest,
  res: Response,
  next: NextFunction
) => {
  const { idExercise } = req.params;

  try {
    const exercise = await Exercise.findByIdAndDelete({
      _id: idExercise,
      createdBy: req.createdBy,
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

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabaseBucket = process.env.SUPABACE_BUCKET!;

const supabase = createClient(supabaseUrl, supabaseKey);

export const createExercise = async (
  req: CustomCreateExerciseRequest,
  res: Response,
  next: NextFunction
) => {
  const exerciseDetails = req.body;

  try {
    const imageName = req.file?.filename;

    const image = await fs.readFile(path.join("uploads", imageName!));

    await supabase.storage.from(supabaseBucket).upload(imageName!, image);

    const {
      data: { publicUrl },
    } = supabase.storage.from(supabaseBucket).getPublicUrl(imageName!);

    const exercise = await Exercise.create({
      ...exerciseDetails,
      image: imageName,
      backupImage: publicUrl,
    });

    res.status(201).json({ exercise });
  } catch (error) {
    const customError = new CustomError(
      "Could not create the exercise",
      400,
      "Could not create the exercise"
    );

    next(customError);
  }
};
