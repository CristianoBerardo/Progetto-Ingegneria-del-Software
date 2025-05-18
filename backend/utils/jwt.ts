import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const secret = process.env.JWT_SECRET || "";

export const generateToken = (payload: any) => {
  return jwt.sign(payload, secret, { expiresIn: "7d" });
};
