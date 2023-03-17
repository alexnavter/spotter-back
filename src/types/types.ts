import { type Request } from "express";
import {
  type LoginCredentials,
  type RegisterCredentials,
} from "../server/controllers/usersControllers/types";

export interface ExerciseStructure {
  id: string;
  name: string;
  image: string;
  type: string;
  equipment: string;
  difficulty: number;
  muscles: {
    primary: string;
    secondary: string[];
  };
  description: string;
  sets: number;
  reps: number;
  rest: number;
  duration: number;
  createdBy: string;
}

export type ExercisesStructure = ExerciseStructure[];

export type CustomCreateExerciseRequest = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  ExerciseStructure
>;

export type CustomRegisterRequest = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  RegisterCredentials
>;

export type CustomLoginRequest = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  LoginCredentials
>;

export interface CustomUserRequest extends Request {
  createdBy: string;
}
