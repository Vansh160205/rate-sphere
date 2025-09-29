import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/authTypes";

function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "1d" });
}

function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
}

export default { generateToken, verifyToken };
