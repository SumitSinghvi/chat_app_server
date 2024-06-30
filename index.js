import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import db from './config.js';

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
