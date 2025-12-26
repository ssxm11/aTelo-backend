// ============================================
// src/controllers/taskController.ts - Controlador de Tasks
// ============================================
import { Request, Response } from 'express';
import { Task, ITask } from '../models/Task';
import { Types } from 'mongoose';
import { Goal } from '../models/Goal';

// Extender Request para incluir userId del middleware de auth
interface AuthRequest extends Request {
  userId?: string;
}

export class TaskController {
  
  // Crear nueva tarea
  static async createTask(req: Request, res: Response): Promise<void> {
  try {
    const { goalId } = req.params;
    const { title, description, status, priority, dueDate } = req.body;

    // 🔒 Validar que la goal exista y sea del usuario
    const goal = await Goal.findOne({
      _id: goalId,
      user: req.user!.id,
    });

    if (!goal) {
      res.status(404).json({
        success: false,
        message: 'Goal not found',
      });
      return; // 🔥 IMPORTANTE
    }

    // ✅ Crear task ligada a la goal y al user autenticado
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      goal: goalId,
      user: req.user!.id,
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating task',
    });
  }
}


  // Obtener todas las tareas del usuario
 static async getAllTasks(req: Request, res: Response): Promise<void> {
  try {
    const { goalId } = req.params;
    const { status, priority } = req.query;

    // Validar goal
    const goal = await Goal.findOne({
      _id: goalId,
      user: req.user!.id,
    });

    if (!goal) {
      res.status(404).json({
        success: false,
        message: 'Goal not found',
      });
      return;
    }

    const filter: any = {
      goal: goalId,
      user: req.user!.id,
    };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching tasks',
    });
  }
}


  // Obtener una tarea por ID
  static async getTaskById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const task = await Task.findOne({ _id: id, user: req.user!.id, });

      if (!task) {
        res.status(404).json({
          success: false,
          message: 'Task not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: task
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error fetching task'
      });
    }
  }

  // Actualizar una tarea
  static async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const updates = req.body;

      // No permitir actualizar el usuario
      delete updates.user;

      const task = await Task.findOneAndUpdate(
        { _id: id, user: req.user!.id },
        updates,
        { new: true, runValidators: true }
      );

      if (!task) {
        res.status(404).json({
          success: false,
          message: 'Task not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: task
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error updating task'
      });
    }
  }

  // Eliminar una tarea
  static async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const task = await Task.findOneAndDelete({ _id: id, user: userId });

      if (!task) {
        res.status(404).json({
          success: false,
          message: 'Task not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
        data: task
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error deleting task'
      });
    }
  }

  // Obtener estadísticas de tareas
  static async getTaskStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      const stats = await Task.aggregate([
        { $match: { user: new Types.ObjectId(userId) } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const priorityStats = await Task.aggregate([
        { $match: { user: new Types.ObjectId(userId) } },
        {
          $group: {
            _id: '$priority',
            count: { $sum: 1 }
          }
        }
      ]);

      const total = await Task.countDocuments({ user: userId });

      res.status(200).json({
        success: true,
        data: {
          total,
          byStatus: stats,
          byPriority: priorityStats
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error fetching stats'
      });
    }
  }
}
