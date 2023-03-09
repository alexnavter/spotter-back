import { type Request, type Response, type NextFunction } from "express";
import { CustomError } from "../../CustomError/CustomError";
import User from "../../database/models/User";
import { type CustomRequest } from "../../types";
import { UserStructure, type UserCredentials } from "./types";
import { loginUser } from "./userControllers";

const req: Partial<Request> = {};

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
const next: Partial<NextFunction> = jest.fn();

beforeEach(() => jest.clearAllMocks());

const mockUser: UserCredentials = {
  email: "alex@gmail.com",
  password: "alex1234",
};

describe("Given a loginUser controller", () => {
  describe("When it receives a request with the email 'alex@gmail.com' and the password 'alex1234' and the email is not in the database", () => {
    test("Then it should call its next method with status 401 and the message 'Wrong credentials'", async () => {
      const expectedError = new CustomError(
        "Introduced email not found",
        401,
        "Wrong credentials"
      );

      req.body = mockUser;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(undefined),
      }));

      await loginUser(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When the token or database or another error is thrown", () => {
    test("Then it should call its next method passing that error", async () => {
      const error = new Error();

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockRejectedValue(error),
      }));

      await loginUser(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
