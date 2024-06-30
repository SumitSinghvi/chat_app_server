import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  database: process.env.DB_NAME || 'chat_app',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

export default db;
