import { Router } from "express";
import * as ratingController from "../controllers/ratingController";
import { authenticate, authorize } from "../middlewares/authMiddleware";
import { createRatingValidator, updateRatingValidator } from "../validators/ratingValidator";

const router = Router();

// Users can create/update ratings
router.post("/", authenticate, authorize("USER"), createRatingValidator, ratingController.createRating);
router.put("/:id", authenticate, authorize("USER"), updateRatingValidator, ratingController.updateRating);

// Store owners or Admin can view ratings for a store
router.get("/store/:storeId", authenticate, authorize("STORE_OWNER", "ADMIN"), ratingController.getRatingsByStore);

export default router;
