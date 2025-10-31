import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import UserForm from "./UserForm";
import "./UserList.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      await api.post("/users", userData);
      setShowForm(false);
      loadUsers();
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      alert("Erro ao criar usuário");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Tem certeza que deseja deletar este usuário?")) {
      try {
        await api.delete(`/users/${userId}`);
        loadUsers();
      } catch (error) {
        console.error("Erro ao deletar usuário:", error);
        alert("Erro ao deletar usuário");
      }
    }
  };

  if (loading) return <div className="loading">Carregando usuários...</div>;

  return (
    <div className="user-list">
      <div className="user-header">
        <h2>Gerenciar Usuários</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          Novo Usuário
        </button>
      </div>

      {showForm && (
        <UserForm
          onSubmit={handleCreateUser}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Cargo</th>
              <th>Data de Criação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role === "admin"
                      ? "👑 Administrador"
                      : "👤 Consultor"}
                  </span>
                </td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="btn-delete"
                    disabled={user.role === "admin"}
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="empty-state">Nenhum usuário encontrado</div>
      )}
    </div>
  );
};

export default UserList;
