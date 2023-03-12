import "../../loadEnvironment.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { type NextFunction, type Request, type Response } from "express";
import { CustomError } from "../../CustomError/CustomError.js";
import User from "../../database/models/User.js";
import {
  type UserStructure,
  type CustomJwtPayload,
  type UserCredentials,
} from "./types.js";

export const loginUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserCredentials
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

      next(customError);

      return;
    }

    if (!(await bcrypt.compare(password, user.password))) {
      const customError = new CustomError(
        "Incorrect password",
        401,
        "Wrong credentials"
      );

      next(customError);

      return;
    }

    const jwtPayload: CustomJwtPayload = {
      sub: user?._id.toString(),
      email: user.email,
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
      expiresIn: "2d",
    });

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

export const registerUser = async (
  req: Request<Record<string, unknown>, Record<string, unknown>, UserStructure>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);

    const emailToFind = await User.findOne({ email });
    const userNameToFind = await User.findOne({ username });

    if (emailToFind) {
      const customError = new CustomError(
        "Email already exists",
        409,
        "Email already exists"
      );

      throw customError;
    }

    if (userNameToFind) {
      const customError = new CustomError(
        "Username already exists",
        409,
        "Username already exists"
      );

      throw customError;
    }

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
