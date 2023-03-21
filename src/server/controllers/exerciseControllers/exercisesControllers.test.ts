import {
  type CustomRequest,
  type ExercisesData,
  type ExerciseData,
} from "../../../types/types";
import {
  createExercise,
  deleteExercise,
  findExercise,
  getExercises,
  getUserExercises,
} from "./exercisesControllers";
import { type Request, type Response } from "express";
import { CustomError } from "../../../CustomError/CustomError";
import { Exercise } from "../../../database/models/Exercise";

const mockBenchPress: ExerciseData = {
  id: "",
  name: "Bench Press",
  type: "strength",
  equipment: "Barbell",
  difficulty: "3",
  muscles: "Chest",
  description:
    "Lie on a bench with a barbell, lower it to your chest, and then push it back up.",
  sets: "3",
  reps: "10",
  rest: "60",
  duration: "0",
  image: "https://example.com/bench-press.jpg",
  createdBy: "Alex0987",
};

const mockSquat: ExerciseData = {
  id: "",
  name: "Squat",
  type: "strength",
  equipment: "Barbell",
  difficulty: "4",
  muscles: "Quadriceps",
  description:
    "Place a barbell on your shoulders behind your neck, bend your knees to lower your hips until your thighs are parallel to the floor, then extend your legs to return to standing.",
  sets: "3",
  reps: "8",
  rest: "90",
  duration: "0",
  image: "https://example.com/squat.jpg",
  createdBy: "",
};

const mockExercisesList: ExercisesData = [mockBenchPress, mockSquat];

beforeEach(() => jest.resetAllMocks());

describe("Given a getExercises controller", () => {
  describe("When it receives a response", () => {
    test("Then it should call its status method with status code 200", async () => {
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

describe("Given a getUserExercises controller", () => {
  describe("When it receives a response", () => {
    test("Then it should call its status method with 200", async () => {
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(mockExercisesList),
      };
      const req: Partial<Request> = {};
      const next = jest.fn();
      const expectedStatusCode = 200;
      req.body = { createdBy: "afdafewqasca12312xa" };

      Exercise.find = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue({ createdBy: "afdafewqasca12312xa" }),
      }));

      await getUserExercises(req as CustomRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });

    test("Then it should call its json method", async () => {
      const req: Partial<Request> = {};

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(mockExercisesList),
      };
      const next = jest.fn();

      req.params = { postedBy: "afdafewqasca12312xa" };

      Exercise.find = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue(mockExercisesList),
      }));

      await getUserExercises(req as CustomRequest, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({ exercises: mockExercisesList });
    });
  });

  describe("When it receives a bad request", () => {
    test("Then it should call its next function with an error", async () => {
      const req: Partial<Request> = {};

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue({}),
      };

      const next = jest.fn();

      const expectedError = new CustomError(
        "Bad request",
        400,
        "Couldn't retrieve exercises"
      );

      req.body = {};

      await getUserExercises(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a deleteExercise controller", () => {
  describe("When it receives a response", () => {
    test("Then it should call its status method with status 200", async () => {
      const req: Partial<CustomRequest> = {
        params: { id: `${mockBenchPress.id}` },
      };

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(mockBenchPress.id),
      };

      const next = jest.fn();

      const expectedStatus = 200;

      Exercise.findByIdAndDelete = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue(mockBenchPress),
      }));

      await deleteExercise(req as CustomRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives a bad request", () => {
    test("Then it should call its next function with an error", async () => {
      const req: Partial<CustomRequest> = {};

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue({}),
      };

      const next = jest.fn();

      req.params = {};

      const expectedError = new CustomError(
        "Something went wrong",
        500,
        "Could not delete the exercise"
      );

      Exercise.findByIdAndDelete = jest.fn().mockReturnValue(undefined);

      await deleteExercise(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a createEvent controller", () => {
  describe("When it receives a response", () => {
    test("Then it should respond with status 201", async () => {
      const req: Partial<CustomRequest> = {};
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(mockBenchPress),
      };
      const next = jest.fn();

      req.body = mockBenchPress;

      const expectedStatus = 201;

      Exercise.create = jest.fn().mockReturnValue(mockBenchPress);

      await createExercise(req as CustomRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });

    test("Then it should call its json method", async () => {
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(mockBenchPress),
      };
      const req: Partial<CustomRequest> = {};

      const next = jest.fn();

      req.body = mockBenchPress;

      Exercise.create = jest.fn().mockReturnValue(mockBenchPress);

      await createExercise(req as CustomRequest, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({ exercise: mockBenchPress });
    });
  });

  describe("When it receives a bad request", () => {
    test("Then it should throw an error", async () => {
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue({}),
      };
      const req: Partial<CustomRequest> = {};
      const next = jest.fn();

      const expectedError = new CustomError(
        "An error ocurred at creating the exercise",
        400,
        "Could not create the exercise"
      );

      req.body = {};

      Exercise.create = jest.fn().mockRejectedValue(undefined);

      await createExercise(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a findExercise controller", () => {
  describe("When it receives a response", () => {
    test("Then it should call its status method with status 200", async () => {
      const req: Partial<CustomRequest> = {
        params: { id: `${mockBenchPress.id}` },
      };
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(mockBenchPress.id),
      };
      const next = jest.fn();

      const expectedStatus = 200;

      Exercise.findById = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue(mockBenchPress),
      }));

      await findExercise(req as CustomRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });

    test("Then it should call its json method with the exercise", async () => {
      const req: Partial<CustomRequest> = {
        params: { id: `${mockBenchPress.id}` },
      };
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(mockBenchPress.id),
      };
      const next = jest.fn();

      Exercise.findById = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue(mockBenchPress),
      }));

      await findExercise(req as CustomRequest, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({ exercise: mockBenchPress });
    });
  });

  describe("When a bad request is received", () => {
    test("Then it should call its next method with a custom error in it", async () => {
      const req: Partial<CustomRequest> = {};
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue({}),
      };
      const next = jest.fn();

      req.params = {};

      const newError = new CustomError(
        "Couldn't find the exercise",
        400,
        "Couldn't find the exercise"
      );

      Exercise.findById = jest.fn().mockReturnValue(undefined);

      await findExercise(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(newError);
    });
  });
});
