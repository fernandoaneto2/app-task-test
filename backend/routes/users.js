import express from "express";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.use(authenticate);
router.use(requireAdmin);

router.post("/", createUser);
router.get("/", getUsers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
