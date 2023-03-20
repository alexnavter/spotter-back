import { type NextFunction, type Response } from "express";
import { CustomError } from "../../../CustomError/CustomError.js";
import { type CustomRequest, type ExerciseData } from "../../../types/types.js";
import optimizing from "./optimizing.js";

beforeEach(() => jest.clearAllMocks());

let mockImageFile = jest.fn();

export const mockBenchPress: ExerciseData = {
  id: "marcelino1234",
  name: "benchpress",
  type: "Upper body",
  equipment: "Barbell, Bench",
  difficulty: "3",
  muscles: "Chest",
  description:
    "Lie on a bench with a barbell, lower it to your chest, and then push it back up.",
  sets: "3",
  reps: "10",
  rest: "60",
  duration: "0",
  image: "benchpress.jpg",
  createdBy: "Alex",
};

jest.mock("sharp", () => () => ({
  resize: jest.fn().mockReturnValue({
    webp: jest.fn().mockReturnValue({
      toFormat: jest.fn().mockReturnValue({ toFile: mockImageFile }),
    }),
  }),
}));

const req: Partial<CustomRequest> = {
  body: mockBenchPress,
};

const next = jest.fn() as NextFunction;

const res: Partial<Response> = {};

const file: Partial<Express.Multer.File> = {
  filename: "benchpress",
  originalname: "benchpress.jpg",
};

describe("Given an optimizing middleware", () => {
  describe("When it receives a request with an image", () => {
    test("Then it should call its next method and put the optimized image to the request", async () => {
      const expectedImageName = "benchpress.webp";
      req.file = file as Express.Multer.File;

      await optimizing(req as CustomRequest, res as Response, next);

      expect(req.file.filename).toBe(expectedImageName);
    });
  });

  describe("When it receives a request without an image", () => {
    test("Then it should call its next method with an error", async () => {
      const newError = new CustomError(
        "Error optimizing the provided image",
        400,
        "Error optimizing the provided image"
      );

      mockImageFile = jest.fn().mockRejectedValue(undefined);

      await optimizing(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(newError);
    });
  });
});
