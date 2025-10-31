import React, { useState } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./ProjectCard.css";

const ProjectCard = ({ project, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description,
    status: project.status,
    deadline: project.deadline,
  });
  const { isAdmin } = useAuth();

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/projects/${project.id}`, formData);
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Erro ao atualizar projeto:", error);
      alert("Erro ao atualizar projeto");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja deletar este projeto?")) {
      try {
        await api.delete(`/projects/${project.id}`);
        onUpdate();
      } catch (error) {
        console.error("Erro ao deletar projeto:", error);
        alert("Erro ao deletar projeto");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ativo":
        return "#27ae60";
      case "inativo":
        return "#e74c3c";
      case "finalizado":
        return "#3498db";
      default:
        return "#95a5a6";
    }
  };

  if (isEditing) {
    return (
      <div className="project-card editing">
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Descrição"
          />
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
            <option value="finalizado">Finalizado</option>
          </select>
          <input
            type="date"
            value={formData.deadline}
            onChange={(e) =>
              setFormData({ ...formData, deadline: e.target.value })
            }
          />
          <div className="project-actions">
            <button type="submit" className="btn-primary">
              Salvar
            </button>
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="project-card">
      <div className="project-header">
        <h3>{project.name}</h3>
        <span
          className="status-badge"
          style={{ backgroundColor: getStatusColor(project.status) }}
        >
          {project.status}
        </span>
      </div>

      {project.description && (
        <p className="project-description">{project.description}</p>
      )}

      <div className="project-meta">
        <div className="meta-item">
          <strong>Criado por:</strong> {project.created_by_name}
        </div>
        {project.deadline && (
          <div className="meta-item">
            <strong>Prazo:</strong>{" "}
            {new Date(project.deadline).toLocaleDateString()}
          </div>
        )}
        <div className="meta-item">
          <strong>Criado em:</strong>{" "}
          {new Date(project.created_at).toLocaleDateString()}
        </div>
      </div>

      {isAdmin() && (
        <div className="project-actions">
          <button onClick={() => setIsEditing(true)} className="btn-edit">
            Editar
          </button>
          <button onClick={handleDelete} className="btn-delete">
            Deletar
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
