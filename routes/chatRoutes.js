import express from 'express';
import authenticateToken from '../middleware.js/authMiddleware.js';
import { sendMessage, getMessages, markAsRead } from '../controllers/chatController.js';

const router = express.Router();

router.post('/send', authenticateToken, sendMessage);

router.get('/messages/:user1Id/:user2Id', authenticateToken, getMessages);

router.put('/mark-read/:user1Id/:user2Id', authenticateToken, markAsRead);

export default router;
