import "../loadEnvironment.js";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { usersRouter } from "../routers/usersRouter/usersRouter.js";
import options from "./cors.js";
import {
  generalError,
  notFoundError,
} from "./middlewares/errorMiddlewares/errorMiddlewares.js";
import exercisesRouter from "../routers/exercisesRouter/exercisesRouter.js";

export const app = express();

app.disable("x-powered-by");

app.use(morgan("dev"));
app.use(express.json());
app.use(cors(options));

app.use("/users", usersRouter);
app.use("/exercises", exercisesRouter);

app.use(notFoundError);
app.use(generalError);
