import { Router } from "express";
import * as storeController from "../controllers/storeController";
import { authenticate, authorize } from "../middlewares/authMiddleware";
import { createStoreValidator, updateStoreValidator } from "../validators/storeValidator";

const router = Router();

// Public: list stores
router.get("/", authenticate, storeController.getStores);
router.get("/:id", authenticate, storeController.getStoreById);

router.get("/owner/:id", authenticate, storeController.getStoreByOwnerId);


// Admin-only: create, delete
router.post("/", authenticate, authorize("ADMIN"), createStoreValidator, storeController.createStore);
router.delete("/:id", authenticate, authorize("ADMIN"), storeController.deleteStore);

//Admin or Store owner : update
router.put("/:id", authenticate, authorize("ADMIN","STORE_OWNER"), updateStoreValidator, storeController.updateStore);

export default router;
