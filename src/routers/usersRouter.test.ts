import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import connectDatabase from "../database/connectDatabase";
import User from "../database/models/User";
import {
  type RegisterCredentials,
  type LoginCredentials,
} from "../server/controllers/usersControllers/types";
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
  const mockUser: LoginCredentials = {
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
    test("Then it should throw an error with the message 'Wrong credentials' and status 401", async () => {
      const expectedErrorMessage = "Wrong credentials";
      const expectedStatus = 401;
      const mockMarcelUser: LoginCredentials = {
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

  describe("When it receives a request with an email 'alex@gmail.com' with the password 'alex4321' that is not correct", () => {
    test("Then it should response with an error with the message 'Wrong credentials' and status 401", async () => {
      const expectedErrorMessage = "Wrong credentials";
      const expectedStatus = 401;

      const mockAlexUser: LoginCredentials = {
        email: "alex@gmail.com",
        password: "alex4321",
      };

      const response = await request(app)
        .post(loginEndpoint)
        .send(mockAlexUser)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error", expectedErrorMessage);
    });
  });
});

describe("Given a POST at the '/users/register' endpoint", () => {
  const registerRoute = "/users/register";
  const mockUser: RegisterCredentials = {
    email: "alex@gmail.com",
    password: "admin1234567",
    username: "Alex",
  };

  describe("When it receives a request with email 'alex@gmail.com', the username 'Alex' and the password 'admin1234567'", () => {
    test("Then it should respond with a status 201 the message 'User has been created'", async () => {
      jwt.sign = jest.fn().mockImplementation(() => ({
        token: "a123l456e789x",
      }));

      const expectedStatus = 201;

      const response = await request(app)
        .post(registerRoute)
        .send(mockUser)
        .expect(expectedStatus);

      expect(response.body).toStrictEqual({ message: "User has been created" });
    });
  });

  describe("When it receives a request with email 'alex@gmail.com' that already exists and password 'admin7654312' and the username 'Alex'", () => {
    test("Then it should respond with a status 409 and with an object in its body with a property 'error'", async () => {
      await User.create({
        ...mockUser,
        username: "Alex",
        email: "alex@gmail.com",
        password: "admin1234567",
      });

      const expectedStatus = 409;

      const response = await request(app)
        .post(registerRoute)
        .send(mockUser)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("When it receives a request with email 'alex@gmail.com' and password 'admin1234567' and the username 'Alex' that already exists", () => {
    test("Then it should respond with a status 409 and with an object in its body with a property 'error'", async () => {
      await User.create({
        ...mockUser,
        username: "Alex",
        email: "alex@gmail.com",
        password: "admin1234567",
      });

      const expectedStatus = 409;

      const response = await request(app)
        .post(registerRoute)
        .send(mockUser)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error");
    });
  });
});
