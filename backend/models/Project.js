import pool from "../config/database.js";

export const Project = {
  async create(projectData) {
    const [result] = await pool.execute(
      "INSERT INTO projects (name, description, status, deadline, created_by) VALUES (?, ?, ?, ?, ?)",
      [
        projectData.name,
        projectData.description,
        projectData.status || "ativo",
        projectData.deadline,
        projectData.created_by,
      ]
    );
    return this.findById(result.insertId);
  },

  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT p.*, u.name as created_by_name 
             FROM projects p 
             LEFT JOIN users u ON p.created_by = u.id 
             WHERE p.id = ?`,
      [id]
    );
    return rows[0];
  },

  async findAll() {
    const [rows] = await pool.execute(
      `SELECT p.*, u.name as created_by_name 
             FROM projects p 
             LEFT JOIN users u ON p.created_by = u.id 
             ORDER BY p.created_at DESC`
    );
    return rows;
  },

  async update(id, projectData) {
    const fields = [];
    const values = [];

    Object.keys(projectData).forEach((key) => {
      if (projectData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(projectData[key]);
      }
    });

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    await pool.execute(
      `UPDATE projects SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    return this.findById(id);
  },

  async delete(id) {
    await pool.execute("DELETE FROM projects WHERE id = ?", [id]);
  },
};
