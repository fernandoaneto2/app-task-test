import express from "express";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import {
  createTask,
  getTasks,
  getUserTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getTasks);
router.get("/my-tasks", getUserTasks);
router.post("/", requireAdmin, createTask);
router.put("/:id", updateTask);
router.delete("/:id", requireAdmin, deleteTask);

export default router;
