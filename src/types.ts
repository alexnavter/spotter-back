import { type Request } from "express";
import { type UserStructure } from "./server/controllers/types";

export type CustomRequest = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  UserStructure
>;
