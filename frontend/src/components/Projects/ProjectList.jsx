import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import ProjectCard from "./ProjectCard";
import ProjectForm from "./ProjectForm";
import { useAuth } from "../../context/AuthContext";
import "./ProjectList.css";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await api.get("/projects");
      setProjects(response.data);
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      await api.post("/projects", projectData);
      setShowForm(false);
      loadProjects();
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
      alert("Erro ao criar projeto");
    }
  };

  if (loading) return <div className="loading">Carregando projetos...</div>;

  return (
    <div className="project-list">
      <div className="project-header">
        <h2>Projects</h2>
        {isAdmin() && (
          <button onClick={() => setShowForm(true)} className="btn-primary">
            Novo Projeto
          </button>
        )}
      </div>

      {showForm && (
        <ProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onUpdate={loadProjects}
          />
        ))}
      </div>

      {projects.length === 0 && (
        <div className="empty-state">Nenhum projeto encontrado</div>
      )}
    </div>
  );
};

export default ProjectList;
