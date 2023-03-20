import { type Request } from "express";
import type * as core from "express-serve-static-core";
import { type InferSchemaType } from "mongoose";
import { type exerciseSchema } from "../database/models/Exercise";

export interface ExerciseData {
  id: string;
  name: string;
  type: string;
  equipment: string;
  difficulty: string;
  muscles: string;
  description: string;
  sets: string;
  reps: string;
  rest: string;
  duration: string;
  image: string;
  createdBy: string;
}

export type ExercisesData = ExerciseData[];

export type ExerciseStructure = InferSchemaType<typeof exerciseSchema>;

export interface CustomRequest<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any
> extends Request<P, ResBody, ReqBody> {
  userId?: string;
}
