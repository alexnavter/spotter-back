import Exercise from "../../../database/models/Exercise";
import {
  type ExercisesStructure,
  type ExerciseStructure,
} from "../../../types/types";
import { getExercises } from "./exercisesControllers";
import { type Request, type Response } from "express";
import { CustomError } from "../../../CustomError/CustomError";

const mockBenchPress: ExerciseStructure = {
  name: "Bench Press",
  type: "strength",
  equipment: "Barbell, Bench",
  difficulty: 3,
  muscles: {
    primary: "Chest",
    secondary: ["Triceps", "Shoulders"],
  },
  description:
    "Lie on a bench with a barbell, lower it to your chest, and then push it back up.",
  sets: 3,
  reps: 10,
  rest: 60,
  duration: 0,
  image: "https://example.com/bench-press.jpg",
};

const mockSquat: ExerciseStructure = {
  name: "Squat",
  type: "strength",
  equipment: "Barbell, Power Rack",
  difficulty: 4,
  muscles: {
    primary: "Quadriceps",
    secondary: ["Glutes", "Hamstrings"],
  },
  description:
    "Place a barbell on your shoulders behind your neck, bend your knees to lower your hips until your thighs are parallel to the floor, then extend your legs to return to standing.",
  sets: 3,
  reps: 8,
  rest: 90,
  duration: 0,
  image: "https://example.com/squat.jpg",
};

const mockExercisesList: ExercisesStructure = [mockBenchPress, mockSquat];

beforeEach(() => jest.resetAllMocks());

describe("Given getEvents controller", () => {
  describe("When it receives a response", () => {
    test("Then it should call its status method with code 200", async () => {
      const req: Partial<Request> = {};
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(mockExercisesList),
      };
      const next = jest.fn();
      const expectedStatus = 200;

      Exercise.find = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue(mockExercisesList),
      }));

      await getExercises(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });

    test("Then it should call its json method", async () => {
      const req: Partial<Request> = {};
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(mockExercisesList),
      };
      const next = jest.fn();

      Exercise.find = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue(mockExercisesList),
      }));

      await getExercises(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({ exercises: mockExercisesList });
    });
  });

  describe("When it receives a bad request", () => {
    test("Then it should call its next function", async () => {
      const req: Partial<Request> = {};
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue({}),
      };
      const next = jest.fn();

      const expectedError = new CustomError(
        "Bad request",
        400,
        "Couldn't retrieve any exercises"
      );

      req.body = {};

      Exercise.find = jest.fn().mockReturnValue(undefined);

      await getExercises(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
