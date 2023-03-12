import { type Request, type Response, type NextFunction } from "express";
import { CustomError } from "../../CustomError/CustomError";
import User from "../../database/models/User";
import {
  type CustomLoginRequest,
  type CustomRegisterRequest,
} from "../../types";
import { type RegisterCredentials, type LoginCredentials } from "./types";
import { loginUser, registerUser } from "./userControllers";
import bcrypt from "bcryptjs";

beforeEach(() => jest.clearAllMocks());

describe("Given a loginUser controller", () => {
  const req: Partial<Request> = {};

  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next: Partial<NextFunction> = jest.fn();

  const mockUser: LoginCredentials = {
    email: "alex@gmail.com",
    password: "alex1234",
  };

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
        req as CustomLoginRequest,
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
        req as CustomLoginRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a registerUser controller", () => {
  const req: Partial<Request> = {};

  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next: Partial<NextFunction> = jest.fn();
  describe("When it receives a request with email 'alex@gmail.com', username 'Alex and password 'admin1234'", () => {
    test("Then it should call its status method with code 201 and its json method with the created user", async () => {
      const expectedStatusCode = 201;
      const expectedBodyResponse = { message: "User has been created" };

      const mockCreateUser: RegisterCredentials = {
        username: "Alex",
        email: "alex@gmail.com",
        password: "admin1234",
      };

      req.body = mockCreateUser;

      bcrypt.hash = jest.fn().mockResolvedValue("asda123hjassdasdascasd123hjk");
      User.create = jest.fn().mockResolvedValue(mockCreateUser);

      await registerUser(
        req as CustomRegisterRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith(expectedBodyResponse);
    });
  });

  describe("When there is a database error or another error is thrown", () => {
    test("Then it should call its next method passing that error", async () => {
      const newUser: RegisterCredentials = {
        username: "Alex",
        email: "alex@gmail.com",
        password: "admin1234",
      };

      const expectedError = new CustomError(
        "Error",
        500,
        "Couldn't register the user"
      );

      req.body = newUser;

      User.create = jest.fn().mockImplementationOnce(() => {
        throw new Error("Error");
      });

      await registerUser(
        req as CustomRegisterRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
