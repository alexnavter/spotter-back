import "../../../loadEnvironment.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { type NextFunction, type Request, type Response } from "express";
import { CustomError } from "../../../CustomError/CustomError.js";
import User from "../../../database/models/User.js";
import {
  type RegisterCredentials,
  type CustomJwtPayload,
  type LoginCredentials,
} from "./types.js";
import { type CustomRequest } from "../../../types/types.js";

export const loginUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    LoginCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  const { password, email } = req.body;
  try {
    const user = await User.findOne({ email }).exec();

    if (!user) {
      const customError = new CustomError(
        "Introduced email not found",
        401,
        "Wrong credentials"
      );

      throw customError;
    }

    if (!(await bcrypt.compare(password, user.password))) {
      const customError = new CustomError(
        "Incorrect password",
        401,
        "Wrong credentials"
      );

      throw customError;
    }

    const jwtPayload: CustomJwtPayload = {
      sub: user._id.toString(),
      email: user.email,
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

export const registerUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    RegisterCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 8);

    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User has been created" });
  } catch (error) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "Couldn't register the user"
    );

    next(customError);
  }
};
