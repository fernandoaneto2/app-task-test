import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Pages.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await api.get("/projects");
      setProjects(response.data);
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
      // Dados mock para desenvolvimento
      setProjects([
        {
          id: 1,
          name: "Nokia Olinda",
          description: "Trafego pago",
          status: "ativo",
          deadline: "2025-10-29",
          created_by_name: "Administrador",
        },
        {
          id: 2,
          name: "LV OFFICE",
          description: "GEM",
          status: "ativo",
          deadline: "2025-10-29",
          created_by_name: "Administrador",
        },
        {
          id: 3,
          name: "PROJETO TESTEEE",
          description: "trafego",
          status: "ativo",
          deadline: "2025-10-30",
          created_by_name: "Administrador",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "ativo":
        return "🟢";
      case "inativo":
        return "🔴";
      case "finalizado":
        return "✅";
      default:
        return "⚪";
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner"></div>
        <p>Carregando projetos...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">
          <h1>📁 Projetos</h1>
          <p>Gerencie todos os projetos da empresa</p>
        </div>
        {user?.role === "admin" && (
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            + Novo Projeto
          </button>
        )}
      </div>

      <div className="content-grid">
        {projects.map((project) => (
          <div key={project.id} className="card">
            <div className="card-header">
              <div className="card-title">
                <span className="status-icon">
                  {getStatusIcon(project.status)}
                </span>
                <h3>{project.name}</h3>
              </div>
              <span className={`status-badge ${project.status}`}>
                {project.status}
              </span>
            </div>

            <div className="card-content">
              <p className="description">{project.description}</p>

              <div className="card-meta">
                <div className="meta-item">
                  <span className="meta-label">📅 Prazo:</span>
                  <span className="meta-value">
                    {new Date(project.deadline).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">👤 Responsável:</span>
                  <span className="meta-value">{project.created_by_name}</span>
                </div>
              </div>
            </div>

            <div className="card-actions">
              <button className="btn-secondary">Ver Detalhes</button>
              {user?.role === "admin" && (
                <button className="btn-danger">Excluir</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <h3>Nenhum projeto encontrado</h3>
          <p>Crie o primeiro projeto para começar</p>
        </div>
      )}
    </div>
  );
};

export default Projects;
