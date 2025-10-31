import React, { useState } from "react";
import "./UserForm.css";

const UserForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
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
    <div className="user-form-overlay">
      <div className="user-form">
        <h3>Novo Usuário</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Senha:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label>Cargo:</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="user">Consultor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Criar Usuário
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

export default UserForm;
