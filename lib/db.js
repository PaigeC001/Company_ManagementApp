require('dotenv').config();
const { Client } = require('pg');

// PostgreSQL client setup using .env variables
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

client.connect();

const db = {
  getDepartments: async () => {
    const res = await client.query('SELECT * FROM department');
    return res.rows;
  },
  getRoles: async () => {
    const res = await client.query(`
      SELECT r.id, r.title, r.salary, d.name AS department 
      FROM role r 
      JOIN department d ON r.department_id = d.id
    `);
    return res.rows;
  },
  getEmployees: async () => {
    const res = await client.query(`
      SELECT e.id, e.first_name, e.last_name, r.title AS job_title, 
             d.name AS department, r.salary, m.first_name AS manager 
      FROM employee e
      JOIN role r ON e.role_id = r.id
      JOIN department d ON r.department_id = d.id
      LEFT JOIN employee m ON e.manager_id = m.id
    `);
    return res.rows;
  },
  addDepartment: async (name) => {
    await client.query('INSERT INTO department (name) VALUES ($1)', [name]);
  },
  addRole: async (title, salary, department_id) => {
    await client.query(
      'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', 
      [title, salary, department_id]
    );
  },
  addEmployee: async (first_name, last_name, role_id, manager_id) => {
    await client.query(
      'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', 
      [first_name, last_name, role_id, manager_id]
    );
  },
  updateEmployeeRole: async (employeeId, newRoleId) => {
    await client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [newRoleId, employeeId]);
  },
};

module.exports = db;