import { Router } from 'express';
import { protect } from '../middleware/auth';
import { GoalController } from '../controllers/goalController';
import { TaskController } from '../controllers/taskController';

const router = Router();

// 🔐 Todas las rutas requieren autenticación
router.use(protect);

// =======================
// Goals CRUD
// =======================

// Crear una goal
router.post('/', GoalController.createGoal);

// Obtener todas las goals del usuario
router.get('/', GoalController.getGoals);

// Dashboard (goals + intenciones)
router.get('/dashboard', GoalController.getDashboardGoals);


// Obtener una goal por ID
router.get('/:id', GoalController.getGoalById);

// Actualizar una goal
router.put('/:id', GoalController.updateGoal);
router.patch('/:id', GoalController.updateGoal);

// Eliminar una goal
router.delete('/:id', GoalController.deleteGoal);



// =======================
// Tasks dentro de una Goal
// =======================

// Obtener todas las tasks de una goal
router.get('/:goalId/tasks', TaskController.getAllTasks);

// Crear una task dentro de una goal
router.post('/:goalId/tasks', TaskController.createTask);



export default router;
