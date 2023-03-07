import "../../loadEnvironment.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { type NextFunction, type Request, type Response } from "express";
import { CustomError } from "../../CustomError/CustomError.js";
import User from "../../database/models/User.js";
import { type CustomJwtPayload, type UserCredentials } from "./types.js";

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

    if (!user || !(await bcrypt.compare(password, user.password))) {
      const error = new CustomError(
        "Wrong credentials",
        401,
        "Wrong credentials"
      );

      next(error);

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
