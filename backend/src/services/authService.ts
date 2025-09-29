import prisma from "../config/db";
import bcryptUtils from "../utils/bcryptUtils";
import jwtUtils from "../utils/jwtUtils";
import { SignupInput } from "../types/authTypes";

export async function signup(data: SignupInput) {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) throw new Error("Email already registered");

  const hashedPassword = await bcryptUtils.hashPassword(data.password);

  const user = await prisma.user.create({
    data: { 
      ...data, 
      password: hashedPassword, 
      role: data.role ?? "USER" 
    },
  });

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const isValid = await bcryptUtils.comparePassword(password, user.password);
  if (!isValid) throw new Error("Invalid credentials");

  return {user:user,token:jwtUtils.generateToken({ id: user.id, role: user.role })};
}
