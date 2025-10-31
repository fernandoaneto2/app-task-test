import pool from "../config/database.js";

export const Task = {
  async create(taskData) {
    const [result] = await pool.execute(
      `INSERT INTO tasks (title, description, project_id, assigned_to, assigned_by, status, priority, deadline, note) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        taskData.title,
        taskData.description,
        taskData.project_id,
        taskData.assigned_to,
        taskData.assigned_by,
        taskData.status || "pendente",
        taskData.priority || "media",
        taskData.deadline,
        taskData.note,
      ]
    );
    return this.findById(result.insertId);
  },

  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT t.*, 
                    u_assigned.name as assigned_to_name, 
                    u_assigned.email as assigned_to_email,
                    u_assigned_by.name as assigned_by_name,
                    p.name as project_name
             FROM tasks t
             LEFT JOIN users u_assigned ON t.assigned_to = u_assigned.id
             LEFT JOIN users u_assigned_by ON t.assigned_by = u_assigned_by.id
             LEFT JOIN projects p ON t.project_id = p.id
             WHERE t.id = ?`,
      [id]
    );
    return rows[0];
  },

  async findAll(userId = null, userRole = null) {
    let query = `
            SELECT t.*, 
                   u_assigned.name as assigned_to_name, 
                   u_assigned.email as assigned_to_email,
                   u_assigned_by.name as assigned_by_name,
                   p.name as project_name
            FROM tasks t
            LEFT JOIN users u_assigned ON t.assigned_to = u_assigned.id
            LEFT JOIN users u_assigned_by ON t.assigned_by = u_assigned_by.id
            LEFT JOIN projects p ON t.project_id = p.id
        `;

    const params = [];

    if (userRole === "user") {
      query += " WHERE t.assigned_to = ?";
      params.push(userId);
    }

    query += " ORDER BY t.created_at DESC";

    const [rows] = await pool.execute(query, params);
    return rows;
  },

  async update(id, taskData) {
    const fields = [];
    const values = [];

    Object.keys(taskData).forEach((key) => {
      if (taskData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(taskData[key]);
      }
    });

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    await pool.execute(
      `UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    return this.findById(id);
  },

  async delete(id) {
    await pool.execute("DELETE FROM tasks WHERE id = ?", [id]);
  },

  async findByUser(userId) {
    const [rows] = await pool.execute(
      `SELECT t.*, 
                    u_assigned_by.name as assigned_by_name,
                    p.name as project_name
             FROM tasks t
             LEFT JOIN users u_assigned_by ON t.assigned_by = u_assigned_by.id
             LEFT JOIN projects p ON t.project_id = p.id
             WHERE t.assigned_to = ?
             ORDER BY t.created_at DESC`,
      [userId]
    );
    return rows;
  },
};
