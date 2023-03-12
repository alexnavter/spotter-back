import { type JwtPayload } from "jsonwebtoken";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  username: string;
}

export interface CustomJwtPayload extends JwtPayload {
  email: string;
  sub: string;
}
