import bcrypt from "bcryptjs";
import { User } from "../models/User.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const user = await User.update(parseInt(id), updateData);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.delete(parseInt(id));
    res.json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
};
