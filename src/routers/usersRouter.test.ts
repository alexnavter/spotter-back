import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import connectDatabase from "../database/connectDatabase";
import User from "../database/models/User";
import { type UserCredentials } from "../server/controllers/types";
import request from "supertest";
import { app } from "../server";

let mongodbServer: MongoMemoryServer;

beforeAll(async () => {
  mongodbServer = await MongoMemoryServer.create();
  const mongoServerUrl = mongodbServer.getUri();

  await connectDatabase(mongoServerUrl);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongodbServer.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

describe("Given a POST `/users/login` endpoint", () => {
  const loginEndpoint = "/users/login";
  const mockUser: UserCredentials = {
    email: "alex@gmail.com",
    password: "alex1234",
  };

  describe("When it receives a request with the email 'alex@gmail.com' and the password 'alex1234'", () => {
    test("Then it should respond with a status 200 and with an object in its body with a property 'token'", async () => {
      jwt.sign = jest.fn().mockImplementation(() => ({
        token: "dfashkjl1324fdashkj1423",
      }));

      const expectedStatus = 200;
      const hashedPassword = await bcrypt.hash(mockUser.password, 10);

      await User.create({
        ...mockUser,
        password: hashedPassword,
        email: "alex@gmail.com",
        username: "alex",
      });

      const response = await request(app)
        .post(loginEndpoint)
        .send(mockUser)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("token");
    });
  });

  describe("When it receives a request with an email 'marcel@gmail.com' that is not registered and a password 'marcel1234'", () => {
    test("Then it should response with an error with the message 'Wrong credentials' and status 401", async () => {
      const expectedErrorMessage = "Wrong credentials";
      const expectedStatus = 401;
      const mockMarcelUser: UserCredentials = {
        email: "marcel@gmail.com",
        password: "marcel1234",
      };

      const response = await request(app)
        .post(loginEndpoint)
        .send(mockMarcelUser)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error", expectedErrorMessage);
    });
  });

  describe("When it receives a request with an email 'alex@gmail.com' with the password 'alex4321'", () => {
    test("Then it should response with an error with the message 'Wrong credentials' and status 401", async () => {
      const expectedErrorMessage = "Wrong credentials";
      const expectedStatus = 401;
      const hashedPassword = await bcrypt.hash(mockUser.password, 10);

      await User.create({
        ...mockUser,
        password: hashedPassword,
        email: "alex@gmail.com",
        username: "alex",
      });

      const mockMarcelUser: UserCredentials = {
        email: "alex@gmail.com",
        password: "alex4321",
      };

      const response = await request(app)
        .post(loginEndpoint)
        .send(mockMarcelUser)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error", expectedErrorMessage);
    });
  });
});
