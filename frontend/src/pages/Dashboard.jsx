import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    totalProjects: 0,
    activeProjects: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        api.get("/tasks/my-tasks"),
        api.get("/projects"),
      ]);

      const tasks = tasksRes.data;
      const projects = projectsRes.data;

      setStats({
        totalTasks: tasks.length,
        pendingTasks: tasks.filter((t) => t.status === "pendente").length,
        inProgressTasks: tasks.filter((t) => t.status === "em_andamento")
          .length,
        completedTasks: tasks.filter((t) => t.status === "concluido").length,
        totalProjects: projects.length,
        activeProjects: projects.filter((p) => p.status === "ativo").length,
      });

      setRecentTasks(tasks.slice(0, 5));
      setRecentProjects(projects.slice(0, 3));
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
      // Dados mock para desenvolvimento
      setStats({
        totalTasks: 8,
        pendingTasks: 3,
        inProgressTasks: 2,
        completedTasks: 3,
        totalProjects: 4,
        activeProjects: 2,
      });
      setRecentTasks([
        {
          id: 1,
          title: "Configurar ambiente",
          status: "concluido",
          priority: "alta",
          project_name: "Sistema",
          created_at: new Date(),
        },
        {
          id: 2,
          title: "Criar componente Login",
          status: "concluido",
          priority: "alta",
          project_name: "Sistema",
          created_at: new Date(),
        },
        {
          id: 3,
          title: "Implementar Dashboard",
          status: "em_andamento",
          priority: "media",
          project_name: "Sistema",
          created_at: new Date(),
        },
      ]);
      setRecentProjects([
        {
          id: 1,
          name: "Sistema de Tarefas",
          status: "ativo",
          description: "Sistema principal",
          created_by_name: "Admin",
        },
        {
          id: 2,
          name: "Documentação",
          status: "ativo",
          description: "Documentação do projeto",
          created_by_name: "Admin",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Bem-vindo, {user?.name || user?.email}! 👋</h1>
          <p>Aqui está o resumo das suas atividades</p>
        </div>
        <div className="current-date">
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Estatísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-number">{stats.totalTasks}</div>
            <div className="stat-label">Total de Tarefas</div>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-info">
            <div className="stat-number">{stats.pendingTasks}</div>
            <div className="stat-label">Pendentes</div>
          </div>
        </div>

        <div className="stat-card progress">
          <div className="stat-info">
            <div className="stat-number">{stats.inProgressTasks}</div>
            <div className="stat-label">Em Andamento</div>
          </div>
        </div>

        <div className="stat-card completed">
          <div className="stat-info">
            <div className="stat-number">{stats.completedTasks}</div>
            <div className="stat-label">Concluídas</div>
          </div>
        </div>

        {isAdmin() && (
          <>
            <div className="stat-card projects">
              <div className="stat-info">
                <div className="stat-number">{stats.totalProjects}</div>
                <div className="stat-label">Total de Projetos</div>
              </div>
            </div>

            <div className="stat-card active-projects">
              <div className="stat-info">
                <div className="stat-number">{stats.activeProjects}</div>
                <div className="stat-label">Projetos Ativos</div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="dashboard-content">
        {/* Tarefas Recentes */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>📋 Minhas Tarefas Recentes</h2>
            <span className="section-badge">{recentTasks.length} tarefas</span>
          </div>

          {recentTasks.length > 0 ? (
            <div className="tasks-list">
              {recentTasks.map((task) => (
                <div key={task.id} className="task-item">
                  <div className="task-main">
                    <div className="task-title">
                      <span className="priority-icon">
                        {task.priority === "alta"
                          ? "🔴"
                          : task.priority === "media"
                          ? "🟡"
                          : "🟢"}
                      </span>
                      <h4>{task.title}</h4>
                    </div>
                    <p className="task-project">{task.project_name}</p>
                  </div>
                  <div className="task-meta">
                    <span className={`status-badge ${task.status}`}>
                      {task.status === "pendente" && "⏳ Pendente"}
                      {task.status === "em_andamento" && "🔄 Em Andamento"}
                      {task.status === "concluido" && "✅ Concluído"}
                    </span>
                    <span className="task-date">
                      {new Date(task.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>Nenhuma tarefa encontrada</h3>
              <p>Você não tem tarefas atribuídas no momento.</p>
            </div>
          )}
        </div>

        {/* Projetos Recentes (apenas para admin) */}
        {isAdmin() && (
          <div className="dashboard-section">
            <div className="section-header">
              <h2>📁 Projetos Recentes</h2>
              <span className="section-badge">
                {recentProjects.length} projetos
              </span>
            </div>

            {recentProjects.length > 0 ? (
              <div className="projects-list">
                {recentProjects.map((project) => (
                  <div key={project.id} className="project-item">
                    <div className="project-main">
                      <div className="project-title">
                        <span className="status-icon">
                          {project.status === "ativo"
                            ? "🟢"
                            : project.status === "inativo"
                            ? "🔴"
                            : "✅"}
                        </span>
                        <h4>{project.name}</h4>
                      </div>
                      {project.description && (
                        <p className="project-description">
                          {project.description}
                        </p>
                      )}
                    </div>
                    <div className="project-meta">
                      <span className="project-creator">
                        Por: {project.created_by_name}
                      </span>
                      {project.deadline && (
                        <span className="project-deadline">
                          📅 {new Date(project.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📁</div>
                <h3>Nenhum projeto encontrado</h3>
                <p>Crie seu primeiro projeto para começar.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
