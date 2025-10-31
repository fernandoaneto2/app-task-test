import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import { useAuth } from "../../context/AuthContext";
import "./TaskList.css";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState("all"); // 'all' or 'my-tasks'
  const { isAdmin, user } = useAuth();

  useEffect(() => {
    loadTasks();
  }, [view]);

  const loadTasks = async () => {
    try {
      const endpoint = view === "my-tasks" ? "/tasks/my-tasks" : "/tasks";
      const response = await api.get(endpoint);
      setTasks(response.data);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await api.post("/tasks", taskData);
      setShowForm(false);
      loadTasks();
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      alert("Erro ao criar tarefa");
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      await api.put(`/tasks/${taskId}`, updates);
      loadTasks();
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      alert("Erro ao atualizar tarefa");
    }
  };

  if (loading) return <div className="loading">Carregando tarefas...</div>;

  return (
    <div className="task-list">
      <div className="task-header">
        <h2>Tarefas</h2>

        <div className="task-actions">
          {!isAdmin() && (
            <div className="view-toggle">
              <button
                className={view === "my-tasks" ? "active" : ""}
                onClick={() => setView("my-tasks")}
              >
                Minhas Tarefas
              </button>
              <button
                className={view === "all" ? "active" : ""}
                onClick={() => setView("all")}
              >
                Todas as Tarefas
              </button>
            </div>
          )}

          {isAdmin() && (
            <button onClick={() => setShowForm(true)} className="btn-primary">
              Nova Tarefa
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="tasks-container">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdate={handleUpdateTask}
            onDelete={loadTasks}
          />
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="empty-state">Nenhuma tarefa encontrada</div>
      )}
    </div>
  );
};

export default TaskList;
