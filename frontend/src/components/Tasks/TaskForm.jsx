import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import "./TaskForm.css";

const TaskForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project_id: "",
    assigned_to: "",
    status: "pendente",
    priority: "media",
    deadline: "",
    note: "",
  });
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    try {
      const [projectsRes, usersRes] = await Promise.all([
        api.get("/projects"),
        api.get("/users"),
      ]);
      setProjects(projectsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error("Erro ao carregar dados do formulário:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="task-form-overlay">
      <div className="task-form">
        <h3>Nova Tarefa</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Título:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Descrição:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Projeto:</label>
              <select
                name="project_id"
                value={formData.project_id}
                onChange={handleChange}
                required
              >
                <option value="">Selecione um projeto</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Atribuir para:</label>
              <select
                name="assigned_to"
                value={formData.assigned_to}
                onChange={handleChange}
                required
              >
                <option value="">Selecione um usuário</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="pendente">Pendente</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluido">Concluído</option>
              </select>
            </div>

            <div className="form-group">
              <label>Prioridade:</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            <div className="form-group">
              <label>Prazo:</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Nota:</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows="2"
              placeholder="Nota adicional sobre a tarefa..."
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Criar Tarefa
            </button>
            <button type="button" onClick={onCancel}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
