import express from "express";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getProjects);
router.post("/", requireAdmin, createProject);
router.put("/:id", requireAdmin, updateProject);
router.delete("/:id", requireAdmin, deleteProject);

export default router;
