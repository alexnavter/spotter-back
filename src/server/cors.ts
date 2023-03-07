import "../loadEnvironment.js";
import type cors from "cors";

const apiUrl = process.env.API_URL!;
const port = process.env.PORT!;

const allowedOrigins = [`http://localhost:${port}`, apiUrl];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

export default options;
