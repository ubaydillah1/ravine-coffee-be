import jwt from "jsonwebtoken";
import { config } from "../lib/config.js";

interface TokenPayload {
  id: string;
  email: string;
  role?: string;
}

export const generateToken = (data: TokenPayload) => {
  return jwt.sign(data, config.jwtSecret, { expiresIn: "1d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, config.jwtSecret);
};

export const decodeToken = (token: string) => {
  return jwt.decode(token);
};
