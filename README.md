# Spotter API REST

[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=isdi-coders-2023_Alex-Navarro-Final-Project-back-202301-bcn&metric=coverage)](https://sonarcloud.io/summary/new_code?id=isdi-coders-2023_Alex-Navarro-Final-Project-back-202301-bcn)

[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=isdi-coders-2023_Alex-Navarro-Final-Project-back-202301-bcn&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=isdi-coders-2023_Alex-Navarro-Final-Project-back-202301-bcn)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=isdi-coders-2023_Alex-Navarro-Final-Project-back-202301-bcn&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=isdi-coders-2023_Alex-Navarro-Final-Project-back-202301-bcn)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=isdi-coders-2023_Alex-Navarro-Final-Project-back-202301-bcn&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=isdi-coders-2023_Alex-Navarro-Final-Project-back-202301-bcn)

This repository contains the source code for a RESTful API that serves data for a fitness exercises website frontend. The API is built using Node.js and Express, with a MongoDB database, and it is deployed using CD/CI.

## Teck stack

- Node.js: a JavaScript runtime built on Chrome's V8 JavaScript engine that allows you to run JavaScript code outside of a web browser.

- Express: a popular web framework for Node.js that provides a set of features for building web applications, such as handling HTTP requests and responses, middleware support, and routing.

- MongoDB: a NoSQL document-oriented database that stores data in flexible, JSON-like documents, making it a good fit for handling unstructured data such as fitness exercises.

- Mongoose: an Object Data Modeling (ODM) library for MongoDB and Node.js that provides a schema-based solution to model your application data, perform validation, and more.

- JWT: JSON Web Tokens are a standard method for representing claims securely between parties. JWTs can be used to verify the identity of a user who is accessing an API, and to ensure that the data being transmitted hasn't been tampered with.

- TypeScript: a superset of JavaScript that adds optional static typing, which helps catch errors at compile time and improves code maintainability.

## Routes

#### Paths

- Users: /users
- Exercises: /

## User Endpoints

### POST /login

- This endpoint allows a registered user to log in to the website. It expects a JSON payload with the user's email and password. If the user's credentials are correct, the endpoint will return a JSON Web Token (JWT), which is required for accessing other protected endpoints.

### POST /register

- This endpoint allows a new user to register to the website. It expects a JSON payload with the user's name, email, and password. If the registration is successful, the endpoint will return a success message.

## Exercises Endpoint

### GET /

- This endpoint returns all exercises stored in the database. It does not require authentication.

### _Protected endpoints_

### GET /my-exercises

- This endpoint returns all exercises created by the authenticated user. It requires authentication.

### DELETE /delete/:idExercise

- This endpoint deletes an exercise with the given ID. It requires authentication and only the user who created the exercise can delete it.

### POST /create

- This endpoint creates a new exercise. It requires authentication and a JSON payload with the exercise's name, description, and an optional image file. The endpoint will store the image in a cloud storage service (SupaBase) and return the exercise data with the cloud storage URL.

### GET /detail/:idExercise

- This endpoint returns the details of an exercise with the given ID. It requires authentication and only the user who created the exercise can access it.
