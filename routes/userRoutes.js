import express from 'express';
import { readUser, updateUserDetails, deleteUserAccount, getUserByRoles } from '../controllers/userController.js';
import authenticateToken from '../middleware.js/authMiddleware.js';
import { validateUpdate } from '../validators/authValidator.js';

const router = express.Router();

router.get('/profile', readUser);
router.put('/profile', authenticateToken, validateUpdate, updateUserDetails);
router.delete('/profile', authenticateToken, deleteUserAccount);
router.post('/profiles', getUserByRoles);

export default router;
