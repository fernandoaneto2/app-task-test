import React, { useState } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./TaskCard.css";

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    note: task.note,
  });
  const { isAdmin, user } = useAuth();

  const canEdit = isAdmin() || task.assigned_to === user.id;

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/tasks/${task.id}`, formData);
      setIsEditing(false);
      onUpdate(task.id, formData);
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      alert("Erro ao atualizar tarefa");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja deletar esta tarefa?")) {
      try {
        await api.delete(`/tasks/${task.id}`);
        onDelete();
      } catch (error) {
        console.error("Erro ao deletar tarefa:", error);
        alert("Erro ao deletar tarefa");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pendente":
        return "#e74c3c";
      case "em_andamento":
        return "#f39c12";
      case "concluido":
        return "#27ae60";
      default:
        return "#95a5a6";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "alta":
        return "#e74c3c";
      case "media":
        return "#f39c12";
      case "baixa":
        return "#27ae60";
      default:
        return "#95a5a6";
    }
  };

  if (isEditing) {
    return (
      <div className="task-card editing">
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Descrição"
          />
          <div className="form-row">
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="pendente">Pendente</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluido">Concluído</option>
            </select>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
          </div>
          <textarea
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            placeholder="Nota"
            rows="2"
          />
          <div className="task-actions">
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
    <div className="task-card">
      <div className="task-header">
        <h4>{task.title}</h4>
        <div className="task-badges">
          <span
            className="status-badge"
            style={{ backgroundColor: getStatusColor(task.status) }}
          >
            {task.status}
          </span>
          <span
            className="priority-badge"
            style={{ backgroundColor: getPriorityColor(task.priority) }}
          >
            {task.priority}
          </span>
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        <div className="meta-item">
          <strong>Projeto:</strong> {task.project_name}
        </div>
        <div className="meta-item">
          <strong>Atribuído para:</strong>{" "}
          {task.assigned_to_name || "Não atribuído"}
        </div>
        <div className="meta-item">
          <strong>Atribuído por:</strong> {task.assigned_by_name}
        </div>
        {task.deadline && (
          <div className="meta-item">
            <strong>Prazo:</strong>{" "}
            {new Date(task.deadline).toLocaleDateString()}
          </div>
        )}
        {task.note && (
          <div className="meta-item">
            <strong>Nota:</strong> {task.note}
          </div>
        )}
      </div>

      {canEdit && (
        <div className="task-actions">
          <button onClick={() => setIsEditing(true)} className="btn-edit">
            Editar
          </button>
          {isAdmin() && (
            <button onClick={handleDelete} className="btn-delete">
              Deletar
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
