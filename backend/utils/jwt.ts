import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (payload: any) => {
  return jwt.sign(payload, process.env.JWT_SECRET || "", { expiresIn: "7d" });
};
