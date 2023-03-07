import "./loadEnvironment.js";
import { startServer } from "./server/startServer.js";

export const port = process.env.PORT ?? 4000;

startServer(+port);
