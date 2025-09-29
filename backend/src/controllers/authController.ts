import { Request, Response } from "express";
import * as authService from "../services/authService";
import { validationResult } from "express-validator";

export async function signup(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await authService.signup(req.body);
    return res.status(201).json(user);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const token = await authService.login(email, password);
    return res.json(token);
  } catch (error: any) {
    return res.status(401).json({ message: error.message });
  }
}

export async function logout(req: Request, res: Response) {
  return res.json({ message: "Logged out successfully" });
}
