// ============================================
// src/routes/taskRoutes.ts - Rutas de Tasks
// ============================================
import { Router } from 'express';
import { TaskController } from '../controllers/taskController';
import { protect } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas CRUD
router.post('/', TaskController.createTask);
router.get('/', TaskController.getAllTasks);
router.get('/stats', TaskController.getTaskStats);
router.get('/:id', TaskController.getTaskById);
router.put('/:id', TaskController.updateTask);
router.patch('/:id', TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

export default router;

