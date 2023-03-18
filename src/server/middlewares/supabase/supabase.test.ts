import { type NextFunction, type Response } from "express";
import fs from "fs/promises";
import { Exercise } from "../../../database/models/Exercise";
import { type CustomRequest } from "../../../types/types";
import supaBase, { supabase } from "./supabase";

afterEach(async () => {
  jest.clearAllMocks();
});

const mockExercise = new Exercise();
const mockImagePath = "uploads/exercise.jpeg";
const fileToUpload: Partial<Express.Multer.File> = {
  filename: "exercise.jpeg",
};

const req: Partial<CustomRequest> = {
  body: mockExercise,
  file: fileToUpload as Express.Multer.File,
};
const res: Partial<Response> = {};
const next: NextFunction = jest.fn();

describe("Given a supabase middleware", () => {
  describe("When it receives a request with a file to upload", () => {
    test("Then it should rename that file, upload it, and call its next function", async () => {
      fs.readFile = jest.fn().mockRejectedValueOnce(mockImagePath);

      supabase.storage.from("images").upload = jest.fn();
      supabase.storage.from("images").getPublicUrl = jest
        .fn()
        .mockReturnValueOnce({ data: { publicUrl: mockImagePath } });

      await supaBase(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it is receives an invalid request", () => {
    test("Then it should catch an error and invoke its next function with it", async () => {
      const req: Partial<CustomRequest> = {};

      await supaBase(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
