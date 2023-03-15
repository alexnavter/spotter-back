import { type NextFunction, type Response, type Request } from "express";
import { CustomError } from "../../../CustomError/CustomError";
import { type CustomUserRequest } from "../../../types/types";
import jwt from "jsonwebtoken";
import auth from "./auth";
import mongoose from "mongoose";

describe("Given an auth middleware", () => {
  describe("When it receives a request that has not authorization header", () => {
    test("Then it should call its next function with an error, status code 401, and the message 'Missing token'", () => {
      const req: Partial<CustomUserRequest> = {
        header: jest.fn().mockReturnValue(undefined),
      };
      const res: Partial<Response> = {};
      const next: NextFunction = jest.fn();

      const expectedError = new CustomError(
        "Authorization header is missing",
        401,
        "Missing token"
      );

      jwt.verify = jest.fn().mockReturnValueOnce({});

      auth(req as CustomUserRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with the following authorization header: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NDA3MjlkY2U0OWQ5YTNhZmVjNjE3ZjIiLCJlbWFpbCI6ImFsZXhuYXZ0ZXJAZ21haWwuY29tIiwiaWF0IjoxNjc4ODc4OTE2LCJleHAiOjE2NzkwNTE3MTZ9.Ye8aFDa8SnfO8GnMbRc9zibCCLaQuxZ1NJyJuOz9g8k", () => {
    test("Then it should add the token and the createdBy property to the body request and invoke next function", () => {
      const req: Partial<Request> = {};
      const res: Partial<Response> = {};
      const next: NextFunction = jest.fn();

      req.header = jest
        .fn()
        .mockReturnValueOnce(
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NDA3MjlkY2U0OWQ5YTNhZmVjNjE3ZjIiLCJlbWFpbCI6ImFsZXhuYXZ0ZXJAZ21haWwuY29tIiwiaWF0IjoxNjc4ODc4OTE2LCJleHAiOjE2NzkwNTE3MTZ9.Ye8aFDa8SnfO8GnMbRc9zibCCLaQuxZ1NJyJuOz9g8k"
        );

      const createdBy = new mongoose.Types.ObjectId();
      jwt.verify = jest.fn().mockReturnValueOnce({ sub: createdBy });

      auth(req as CustomUserRequest, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(req).toHaveProperty("createdBy", createdBy);
    });
  });

  describe("When it receives a request with authorization header that is missing the Bearer authentication", () => {
    test("Then it should invoke next with error, status code 401, and the message 'Missing bearer authentication in header'", () => {
      const req: Partial<CustomUserRequest> = {
        header: jest.fn().mockReturnValue("123456"),
      };
      const res: Partial<Response> = {};
      const next: NextFunction = jest.fn();

      const expectedError = new CustomError(
        "Missing bearer authentication in header",
        401,
        "Missing token"
      );

      jwt.verify = jest.fn().mockReturnValueOnce({});

      auth(req as CustomUserRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
