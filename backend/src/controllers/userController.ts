import { Request, Response } from "express";
import * as userService from "../services/userService";
import { validationResult } from "express-validator";

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await userService.getUsers();
    return res.json(users);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const user = await userService.getUserById(Number(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    console.log(req.body);
    const user = await userService.updateUser(Number(req.params.id), req.body);
    console.log(user);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    await userService.deleteUser(Number(req.params.id));
    return res.json({ message: "User deleted successfully" });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
}

export async function changePassword(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const userId = (req as any).user.id;
    const { oldPassword, newPassword } = req.body;

    await userService.changePassword(userId, oldPassword, newPassword);
    res.json({ message: "Password updated successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}


export async function getUserStats(req: Request, res: Response) {
  try {
    console.log(req.user)
    const stats = await userService.getUserStats();
    return res.json(stats);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function createUser(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = await userService.createUser(req.body);
    return res.status(201).json(user);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}