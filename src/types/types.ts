import { type Request } from "express";
import {
  type LoginCredentials,
  type RegisterCredentials,
} from "../server/controllers/types";

export interface ExerciseStructure {
  name: string;
  image: string;
  type: "cardio" | "strength" | "hypertrophy";
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
}

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
