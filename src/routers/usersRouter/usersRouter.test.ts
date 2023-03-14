import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import connectDatabase from "../../database/connectDatabase";
import User from "../../database/models/User";
import {
  type RegisterCredentials,
  type LoginCredentials,
} from "../../server/controllers/usersControllers/types";
import request from "supertest";
import { app } from "../../server";
import { CustomError } from "../../CustomError/CustomError";

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

const mockUserInDb: RegisterCredentials = {
  username: "Alex",
  email: "alex@gmail.com",
  password: "admin1234",
};

describe("Given a POST `/users/login` endpoint", () => {
  const loginEndpoint = "/users/login";

  const userToLogin: LoginCredentials = {
    email: "alex@gmail.com",
    password: "admin1234",
  };

  describe("When it receives a request with:  email: 'alex@gmail.com' and password: 'admin1234'", () => {
    test("Then it should respond with a status 200 and with an object in its body with a property 'token'", async () => {
      jwt.sign = jest.fn().mockImplementation(() => ({
        token: "a123l456e789x",
      }));

      const hashedPassword = await bcrypt.hash(userToLogin.password, 10);

      const expectedStatus = 200;

      await User.create({
        ...mockUserInDb,
        password: hashedPassword,
      });

      const response = await request(app)
        .post(loginEndpoint)
        .send(userToLogin)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("token");
    });
  });

  describe("When it receives a request with: email: 'marcel@gmail.com' (that is not registered) and password: 'marcel1234'", () => {
    test("Then it should throw an error with the message 'Wrong credentials' and status 401", async () => {
      const expectedErrorMessage = "Wrong credentials";
      const expectedStatus = 401;
      const mockNonExistingUser: LoginCredentials = {
        email: "marcel@gmail.com",
        password: "marcel1234",
      };

      const response = await request(app)
        .post(loginEndpoint)
        .send(mockNonExistingUser)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error", expectedErrorMessage);
    });
  });

  describe("When it receives a request with: email: 'alex@gmail.com' and password: 'alex4321' (that is not correct)", () => {
    test("Then it should response with an error with the message 'Wrong credentials' and status 401", async () => {
      const expectedError = new CustomError(
        "Incorrect password",
        401,
        "Wrong credentials"
      );

      const expectedStatus = 401;

      const mockWrongPasswordLogin: LoginCredentials = {
        email: "alex@gmail.com",
        password: "patatona",
      };

      await User.create({
        username: "Alex",
        email: "alex@gmail.com",
        password: "patateta",
      });

      const response = await request(app)
        .post(loginEndpoint)
        .send(mockWrongPasswordLogin)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty(
        "error",
        expectedError.publicMessage
      );
    });
  });
});

describe("Given a POST at the '/users/register' endpoint", () => {
  const registerRoute = "/users/register";

  const mockNewUser: RegisterCredentials = {
    username: "Pepe",
    email: "pepe@gmail.com",
    password: "pepe1234",
  };

  describe("When it receives a request with: email: 'pepe@gmail.com', username: 'Pepe' and password: 'pepe1234'", () => {
    test("Then it should respond with a status 201 the message 'User has been created'", async () => {
      const expectedMessage = { message: "User has been created" };

      jwt.sign = jest.fn().mockImplementation(() => ({
        token: "a123l456e789x",
      }));

      const expectedStatus = 201;

      const response = await request(app)
        .post(registerRoute)
        .send(mockNewUser)
        .expect(expectedStatus);

      expect(response.body).toStrictEqual(expectedMessage);
    });
  });
});
