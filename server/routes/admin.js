import { Router } from "express";
import { getAdminStats, getUsers, updateUserRole, deleteUser } from "../controllers/admin.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = Router();

router.use(protect, authorize("admin"));

router.get("/stats", getAdminStats);
router.get("/users", getUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

export default router;
