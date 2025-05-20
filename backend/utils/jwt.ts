import jwt from "jsonwebtoken";

const JWT_SECRET = "supersegreto";

export const generateToken = (payload: any) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};
