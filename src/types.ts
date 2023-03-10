import { type Request } from "express";
import {
  type UserCredentials,
  type UserStructure,
} from "./server/controllers/types";

export type CustomRegisterRequest = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  UserStructure
>;

export type CustomLoginRequest = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  UserCredentials
>;
