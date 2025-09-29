import prisma from "../config/db";
import { UserUpdateInput } from "../types/userTypes";
import bcryptUtils from "../utils/bcryptUtils";

export async function getUsers() {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, address: true },
  });
}

export async function getUserById(id: number) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, address: true },
  });
}

export async function updateUser(id: number, data: UserUpdateInput) {
  return prisma.user.update({
    where: { id },
    data,
  });
}

export async function deleteUser(id: number) {
  return prisma.user.delete({
    where: { id },
  });
}


export async function changePassword(userId: number, oldPassword: string, newPassword: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  // Check if old password matches
  const isMatch = await bcryptUtils.comparePassword(oldPassword, user.password);
  if (!isMatch) throw new Error("Old password is incorrect");

  // Hash new password
  const hashedPassword = await bcryptUtils.hashPassword(newPassword);

  return prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
}

export async function getUserStats() {
  const totalUsers = await prisma.user.count({
    where: { role: "USER" }
  });

  const totalStores = await prisma.store.count();

  const totalRatings = await prisma.rating.count(); 
  console.log(totalRatings,totalStores,totalUsers)
  return { totalUsers, totalStores, totalRatings };
}

export async function createUser(data: UserUpdateInput & { password: string }) {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) throw new Error("Email already registered");
  const hashedPassword = await bcryptUtils.hashPassword(data.password);

  if (!data.name || !data.email || !data.address) {
    throw new Error("Missing required fields: name, email, or address");
  }

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      address: data.address,
      password: hashedPassword,
      role: data.role ?? "USER"
    },
    select: { id: true, name: true, email: true, role: true, address: true },
  });
  return user;
}