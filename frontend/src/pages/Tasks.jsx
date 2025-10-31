import React from "react";
import TaskList from "../components/Tasks/TaskList";
import "./Pages.css";

const Tasks = () => {
  return (
    <div className="page">
      <div className="page-header">
        <h1>✅ Gerenciar Tarefas</h1>
        <p>Atribua e acompanhe o progresso das tarefas</p>
      </div>
      <TaskList />
    </div>
  );
};

export default Tasks;
