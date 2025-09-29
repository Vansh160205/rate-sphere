import { Router } from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import storeRoutes from "./storeRoutes";
import ratingRoutes from './ratingRoutes';

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/stores",storeRoutes);
router.use("/ratings",ratingRoutes);

export default router;
