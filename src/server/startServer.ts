import createDebug from "debug";
import { app } from "./index.js";

const debug = createDebug("spotter-api:startServer");

export const startServer = (port: number) => {
  debug(`Server started at http://localhost:${port}`);

  app.listen(port);
};
