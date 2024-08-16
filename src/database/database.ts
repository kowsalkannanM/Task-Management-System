import mysql, { Pool } from 'mysql2';

interface DBConfig {
  host: string;
  database: string;
  user: string;
  password: string;
}

const dbCredentials: DBConfig = {
      host: "localhost",
      database: "task_management_system",
      user: "root",
      password: "taskdb"
     };

const connection: Pool = mysql.createPool({
  ...dbCredentials,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export { connection };
