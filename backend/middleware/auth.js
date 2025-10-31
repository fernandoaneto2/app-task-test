import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Token de acesso necessário" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.is_active) {
      return res
        .status(401)
        .json({ error: "Usuário não encontrado ou inativo" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Acesso restrito a administradores" });
  }
  next();
};
