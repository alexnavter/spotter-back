import { type NextFunction, type Response } from "express";
import { type CustomRequest } from "../../../types/types";
import { type CustomJwtPayload } from "../../controllers/usersControllers/types";
import jwt from "jsonwebtoken";
import { CustomError } from "../../../CustomError/CustomError.js";

const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      throw new Error("Authorization header is missing");
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new Error("Missing bearer authentication in header");
    }

    const token = authHeader.replace(/^Bearer\s*/, "");

    const { sub: userId } = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as CustomJwtPayload;

    req.userId = userId;

    next();
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      401,
      "Invalid token"
    );
    next(customError);
  }
};

export default auth;
