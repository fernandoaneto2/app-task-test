import { Project } from "../models/Project.js";

export const createProject = async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      created_by: req.user.id,
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar projeto" });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar projetos" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.update(parseInt(id), req.body);
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar projeto" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await Project.delete(parseInt(id));
    res.json({ message: "Projeto deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar projeto" });
  }
};
