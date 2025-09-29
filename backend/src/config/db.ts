import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1); // stop the server if DB is not reachable
  }
}

export default prisma;
