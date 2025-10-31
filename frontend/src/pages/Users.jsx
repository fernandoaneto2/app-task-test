import React from "react";
import UserList from "../components/Users/UserList";
import "./Pages.css";

const Users = () => {
  return (
    <div className="page">
      <div className="page-header">
        <h1>👥 Gerenciar Usuários</h1>
        <p>Administre os membros da sua equipe</p>
      </div>
      <UserList />
    </div>
  );
};

export default Users;
