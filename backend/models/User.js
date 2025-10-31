import pool from "../config/database.js";

export const User = {
  async create(userData) {
    const [result] = await pool.execute(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [
        userData.name,
        userData.email,
        userData.password,
        userData.role || "user",
      ]
    );
    return this.findById(result.insertId);
  },

  async findById(id) {
    const [rows] = await pool.execute(
      "SELECT id, name, email, role, is_active, created_at FROM users WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  async findByEmail(email) {
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    console.log(
      "🔍 Buscando usuário por email:",
      email,
      "Encontrado:",
      rows[0] ? "Sim" : "Não"
    ); // DEBUG
    return rows[0];
  },

  async findAll() {
    const [rows] = await pool.execute(
      "SELECT id, name, email, role, is_active, created_at FROM users WHERE is_active = true"
    );
    return rows;
  },

  async update(id, userData) {
    const fields = [];
    const values = [];

    Object.keys(userData).forEach((key) => {
      if (userData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(userData[key]);
      }
    });

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    await pool.execute(
      `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    return this.findById(id);
  },

  async delete(id) {
    await pool.execute("UPDATE users SET is_active = false WHERE id = ?", [id]);
  },
};
