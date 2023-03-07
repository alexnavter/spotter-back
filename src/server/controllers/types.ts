import { type JwtPayload } from "jsonwebtoken";

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserStructure extends UserCredentials {
  username: string;
}

export interface CustomJwtPayload extends JwtPayload {
  email: string;
  sub: string;
}
