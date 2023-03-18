import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import connectDatabase from "../../database/connectDatabase";
import { app } from "../../server";
import { Exercise } from "../../database/models/Exercise";

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

afterEach(() => {
  jest.clearAllMocks();
});

describe("Given a '/exercises' endpoint", () => {
  describe("When it receives a request with the GET method", () => {
    test("Then it should respond with status code 200", async () => {
      const expectedStatus = 200;
      const exercisesEndpoint = "/exercises";

      await request(app).get(exercisesEndpoint).expect(expectedStatus);
    });
  });
});
