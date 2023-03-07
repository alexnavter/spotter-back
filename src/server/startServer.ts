import createDebug from "debug";
import { app } from "./index.js";

const debug = createDebug("spotter-api:startServer");

export const startServer = (port: number) => {
  app.listen(port);
};
