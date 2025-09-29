import { Router } from "express";
import * as userController from "../controllers/userController";
import { authenticate, authorize } from "../middlewares/authMiddleware";

const router = Router();
router.get("/stats", authenticate, authorize("ADMIN"), userController.getUserStats);
router.post("/", authenticate, authorize("ADMIN"), userController.createUser);

router.get("/", authenticate, authorize("ADMIN"),userController.getUsers);
router.get("/:id", authenticate, authorize("ADMIN"),userController.getUserById);
router.put("/:id", authenticate,authorize("ADMIN"), userController.updateUser);
router.delete("/:id", authenticate,authorize("ADMIN"), userController.deleteUser);

router.put("/me/password",authenticate,authorize("USER","STORE_OWNER"),userController.changePassword);


export default router;
