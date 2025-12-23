// ============================================
// src/routes/userRoutes.ts
// ============================================
import { Router } from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/userController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.use(protect); // Protect all routes

router.get('/', authorize('admin'), getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

export default router;
