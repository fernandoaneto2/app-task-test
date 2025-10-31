import mysql from "mysql2";
import bcrypt from "bcryptjs";

async function setupDatabase() {
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    multipleStatements: true,
  });

  connection.connect((err) => {
    if (err) {
      console.error("❌ Erro de conexão:", err.message);
      return;
    }
    console.log("✅ Conectado ao MySQL");
    createDatabase();
  });

  function createDatabase() {
    const sql = `
            -- Criar database
            DROP DATABASE IF EXISTS task_management_system;
            CREATE DATABASE task_management_system;
            USE task_management_system;

            -- Tabela de usuários
            CREATE TABLE users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'user') DEFAULT 'user',
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );

            -- Tabela de projetos
            CREATE TABLE projects (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                status ENUM('ativo', 'inativo', 'finalizado') DEFAULT 'ativo',
                deadline DATE,
                created_by INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );

            -- Tabela de tarefas
            CREATE TABLE tasks (
                id INT PRIMARY KEY AUTO_INCREMENT,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                project_id INT,
                assigned_to INT,
                assigned_by INT,
                status ENUM('pendente', 'em_andamento', 'concluido') DEFAULT 'pendente',
                priority ENUM('baixa', 'media', 'alta') DEFAULT 'media',
                deadline DATE,
                note TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `;

    connection.query(sql, (err) => {
      if (err) {
        console.error("❌ Erro ao criar tabelas:", err.message);
        connection.end();
        return;
      }
      console.log("✅ Tabelas criadas");
      createAdminUser();
    });
  }

  async function createAdminUser() {
    try {
      // Gerar hash da senha
      const password = "admin123";
      const hashedPassword = await bcrypt.hash(password, 10);

      console.log("🔐 Senha: admin123");
      console.log("🔐 Hash:", hashedPassword);

      // Inserir admin
      connection.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        ["Admin Principal", "admin@empresa.com", hashedPassword, "admin"],
        (err, result) => {
          if (err) {
            console.error("❌ Erro ao inserir admin:", err.message);
            connection.end();
            return;
          }

          const adminId = result.insertId;
          console.log("✅ Admin criado com ID:", adminId);

          // Inserir projetos UM POR UM
          insertProjects(adminId);
        }
      );
    } catch (error) {
      console.error("❌ Erro no bcrypt:", error.message);
      connection.end();
    }
  }

  function insertProjects(adminId) {
    // Projeto 1
    connection.query(
      "INSERT INTO projects (name, description, status, created_by) VALUES (?, ?, ?, ?)",
      [
        "LV OFFICE - GEM",
        "Sistema de gerenciamento de projetos",
        "ativo",
        adminId,
      ],
      (err, result) => {
        if (err) {
          console.error("❌ Erro ao inserir projeto 1:", err.message);
          connection.end();
          return;
        }

        const project1Id = result.insertId;
        console.log("✅ Projeto 1 criado com ID:", project1Id);

        // Projeto 2
        connection.query(
          "INSERT INTO projects (name, description, status, created_by) VALUES (?, ?, ?, ?)",
          ["Nokia Olinda", "Projeto de tráfego pago", "ativo", adminId],
          (err, result) => {
            if (err) {
              console.error("❌ Erro ao inserir projeto 2:", err.message);
              connection.end();
              return;
            }

            const project2Id = result.insertId;
            console.log("✅ Projeto 2 criado com ID:", project2Id);

            // Inserir tarefas
            insertTasks(adminId, project1Id);
          }
        );
      }
    );
  }

  function insertTasks(adminId, projectId) {
    // Tarefa 1
    connection.query(
      "INSERT INTO tasks (title, description, project_id, assigned_to, assigned_by, status, priority) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        "Configurar ambiente",
        "Configurar servidor e banco de dados",
        projectId,
        adminId,
        adminId,
        "concluido",
        "alta",
      ],
      (err) => {
        if (err) {
          console.error("❌ Erro ao inserir tarefa 1:", err.message);
          connection.end();
          return;
        }
        console.log("✅ Tarefa 1 criada");

        // Tarefa 2
        connection.query(
          "INSERT INTO tasks (title, description, project_id, assigned_to, assigned_by, status, priority) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            "Desenvolver login",
            "Criar sistema de autenticação",
            projectId,
            adminId,
            adminId,
            "em_andamento",
            "alta",
          ],
          (err) => {
            if (err) {
              console.error("❌ Erro ao inserir tarefa 2:", err.message);
              connection.end();
              return;
            }
            console.log("✅ Tarefa 2 criada");

            // Tarefa 3
            connection.query(
              "INSERT INTO tasks (title, description, project_id, assigned_to, assigned_by, status, priority) VALUES (?, ?, ?, ?, ?, ?, ?)",
              [
                "Criar dashboard",
                "Desenvolver página principal",
                projectId,
                adminId,
                adminId,
                "pendente",
                "media",
              ],
              (err) => {
                if (err) {
                  console.error("❌ Erro ao inserir tarefa 3:", err.message);
                  connection.end();
                  return;
                }
                console.log("✅ Tarefa 3 criada");

                // Verificar tudo
                verifyData();
              }
            );
          }
        );
      }
    );
  }

  function verifyData() {
    console.log("\n🔍 Verificando dados...");

    // Verificar usuários
    connection.query(
      "SELECT id, name, email, role FROM users",
      (err, users) => {
        if (err) {
          console.error("❌ Erro ao verificar usuários:", err.message);
        } else {
          console.log("👥 Usuários:", users);
        }

        // Verificar projetos
        connection.query(
          "SELECT id, name, description, status FROM projects",
          (err, projects) => {
            if (err) {
              console.error("❌ Erro ao verificar projetos:", err.message);
            } else {
              console.log("📁 Projetos:", projects);
            }

            // Verificar tarefas
            connection.query(
              "SELECT id, title, status, priority FROM tasks",
              (err, tasks) => {
                if (err) {
                  console.error("❌ Erro ao verificar tarefas:", err.message);
                } else {
                  console.log("✅ Tarefas:", tasks);
                }

                console.log("\n🎉 BANCO CONFIGURADO COM SUCESSO!");
                console.log("🔑 CREDENCIAIS: admin@empresa.com / admin123");
                console.log("🌐 URL: http://localhost:3000");

                connection.end();
              }
            );
          }
        );
      }
    );
  }
}

setupDatabase();
