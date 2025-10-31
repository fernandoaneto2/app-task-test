import { Task } from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      assigned_by: req.user.id,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar tarefa" });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll(req.user.id, req.user.role);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar tarefas" });
  }
};

export const getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.findByUser(req.user.id);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar tarefas" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.update(parseInt(id), req.body);
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar tarefa" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await Task.delete(parseInt(id));
    res.json({ message: "Tarefa deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar tarefa" });
  }
};
