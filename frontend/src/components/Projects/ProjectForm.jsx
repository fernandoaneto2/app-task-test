import React, { useState } from "react";
import "./ProjectForm.css";

const ProjectForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "ativo",
    deadline: "",
  });

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
    <div className="project-form-overlay">
      <div className="project-form">
        <h3>Novo Projeto</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome do Projeto:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
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
              <label>Status:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="finalizado">Finalizado</option>
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

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Criar Projeto
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

export default ProjectForm;
