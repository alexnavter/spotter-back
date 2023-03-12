import { type Request } from "express";
import {
  type LoginCredentials,
  type RegisterCredentials,
} from "./server/controllers/types";

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
