import createDebug from "debug";
import { type CustomError } from "../CustomError/CustomError.js";
import { app } from "./index.js";

const debug = createDebug("spotter-api:startServer");

const startServer = async (port: number) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      resolve(server);
    });

    server.on("error", (error: CustomError) => {
      const errorMessage = "Error on starting the server";

      if (error.code === "EADDRINUSE") {
        debug(errorMessage, `The port number ${port} is already in use`);
      }
    });
  });

export default startServer;
