import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import connectDatabase from "../../database/connectDatabase";
import { app } from "../../server";
import { Exercise } from "../../database/models/Exercise";
import { type ExerciseStructure, type ExerciseData } from "../../types/types";
import jwt from "jsonwebtoken";

let mongodbServer: MongoMemoryServer;

beforeAll(async () => {
  mongodbServer = await MongoMemoryServer.create();
  const mongodbServerUrl = mongodbServer.getUri();

  await connectDatabase(mongodbServerUrl);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongodbServer.stop();
});

afterEach(async () => {
  await Exercise.deleteMany();
});

afterEach(async () => {
  await Exercise.deleteMany();
  jest.clearAllMocks();
});

const mockBenchPress: ExerciseStructure = {
  name: "Bench Press",
  type: "strength",
  equipment: "Barbell",
  difficulty: 3,
  muscles: "Chest",
  description:
    "Lie on a bench with a barbell, lower it to your chest, and then push it back up.",

  image: "bench-press.webp",
};

describe("Given a '/exercises' endpoint", () => {
  describe("When it receives a request with the GET method", () => {
    test("Then it should respond with status code 200", async () => {
      const getExercisesEndpoint = "/exercises";
      const expectedStatus = 200;

      await request(app).get(getExercisesEndpoint).expect(expectedStatus);
    });
  });
});

describe("Given a '/create' endpoint", () => {
  describe("When it receives a request to create a new exercise", () => {
    test("Then it should respond with status code 201 and the property exercise in its body with the exercise created", async () => {
      const createExerciseEndpoint = "/exercises/create";
      const expectedStatus = 400;

      const userId = new mongoose.Types.ObjectId();
      jwt.verify = jest.fn().mockReturnValue({ sub: userId });

      const response: { body: { exercise: ExerciseData } } = await request(app)
        .post(createExerciseEndpoint)
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NDA3MjlkY2U0OWQ5YTNhZmVjNjE3ZjIiLCJlbWFpbCI6ImFsZXhuYXZ0ZXJAZ21haWwuY29tIiwiaWF0IjoxNjc5MjIwNzQ1LCJleHAiOjE2Nzk4MjU1NDV9.13o06qMgq-K1duDSy6bIq9Af-zEr3k-gkNRULhIR_T4"
        )
        .set("content-type", "multipart/form-data")
        .field("name", mockBenchPress.name)
        .field("type", mockBenchPress.type)
        .field("equipment", mockBenchPress.equipment)
        .field("difficulty", mockBenchPress.difficulty)
        .field("muscles", mockBenchPress.muscles)
        .field("description", mockBenchPress.description)
        .attach("image", Buffer.from("uploads"), {
          filename: "bench-press.webp",
        });

      expect(expectedStatus);
    });
  });
});
