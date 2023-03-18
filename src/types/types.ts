import { type Request } from "express";
import type * as core from "express-serve-static-core";
import { type InferSchemaType } from "mongoose";
import { type exerciseSchema } from "../database/models/Exercise";

export interface ExerciseData {
  id: string;
  name: string;
  image: string;
  type: string;
  equipment: string[];
  difficulty: number;
  muscles: string[];
  description: string;
  sets: number;
  reps: number;
  rest: number;
  duration: number;
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
