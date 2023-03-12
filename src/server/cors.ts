import "../loadEnvironment.js";
import type cors from "cors";

const allowedOrigins = [
  `${process.env.LOCAL_ORIGIN_URL!}`,
  `${process.env.DEPLOY_ORIGIN_URL!}`,
  `${process.env.REACT_APP_URL_API!}`,
];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

export default options;
