import { type Request, type NextFunction, type Response } from "express";
import mongoose from "mongoose";
import { CustomError } from "../../../CustomError/CustomError";
import auth from "./auth";
import jwt from "jsonwebtoken";
import { type CustomRequest } from "../../../types/types";

afterEach(() => jest.clearAllMocks());

const req: Partial<Request> = {};
const res: Partial<Response> = {};
const next: NextFunction = jest.fn();

describe("Given an auth middleware", () => {
  describe("When it receives a request and the authorization header is missing", () => {
    test("Then it should call its next function with an error, status: 401 and message: 'Missing token'", () => {
      const req: Partial<CustomRequest> = {
        header: jest.fn().mockReturnValue(undefined),
      };

      const expectedStatus = 401;

      const expectedError = new CustomError(
        "Authorization header is missing",
        expectedStatus,
        "Missing token"
      );

      jwt.verify = jest.fn().mockReturnValueOnce({});

      auth(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request and the authorization header startin with 'Bearer ' is missing", () => {
    test("Then it should call its next function with an error, status: 401 and message: 'Missing bearer in Authorization header'", () => {
      const req: Partial<CustomRequest> = {
        header: jest.fn().mockReturnValue("123456"),
      };

      const expectedStatus = 401;

      const expectedError = new CustomError(
        "Missing bearer authentication in header",
        expectedStatus,
        "Missing token"
      );

      jwt.verify = jest.fn().mockReturnValueOnce({});

      auth(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with the authorization header: 'Bearer asdfghjklñqwertyuiop'", () => {
    test("Then it should add the postedBy property and the token to the request and invoke next", () => {
      const req: Partial<CustomRequest> = {};
      req.header = jest.fn().mockReturnValueOnce("Bearer asdfghjklñqwertyuiop");

      const userId = new mongoose.Types.ObjectId();

      jwt.verify = jest.fn().mockReturnValueOnce({ sub: userId });

      auth(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(req).toHaveProperty("userId", userId);
    });
  });

  describe("When it receives a request with an undefined token'", () => {
    test("Then it should add the userId property and the token to the request and invoke next", () => {
      const req: Partial<Request> = {};

      const postedBy = new mongoose.Types.ObjectId();

      jwt.verify = jest.fn().mockReturnValueOnce({ sub: postedBy });

      auth(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
