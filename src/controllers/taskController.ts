// ============================================
// src/controllers/taskController.ts - Controlador de Tasks
// ============================================
import { Request, Response } from 'express';
import { Task, ITask } from '../models/Task';
import { Types } from 'mongoose';

// Extender Request para incluir userId del middleware de auth
interface AuthRequest extends Request {
  userId?: string;
}

export class TaskController {
  
  // Crear nueva tarea
  static async createTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { title, description, status, priority, dueDate } = req.body;
      const userId = req.userId;

      const task = await Task.create({
        title,
        description,
        status,
        priority,
        dueDate,
        user: userId
      });

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error creating task'
      });
    }
  }

  // Obtener todas las tareas del usuario
  static async getAllTasks(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      const { status, priority, sortBy = 'createdAt', order = 'desc' } = req.query;

      // Construir filtro
      const filter: any = { user: userId };
      if (status) filter.status = status;
      if (priority) filter.priority = priority;

      // Construir ordenamiento
      const sortOrder = order === 'asc' ? 1 : -1;
      const sortOptions: any = { [sortBy as string]: sortOrder };

      const tasks = await Task.find(filter).sort(sortOptions);

      res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error fetching tasks'
      });
    }
  }

  // Obtener una tarea por ID
  static async getTaskById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.userId;

      const task = await Task.findOne({ _id: id, user: userId });

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
  static async updateTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.userId;
      const updates = req.body;

      // No permitir actualizar el usuario
      delete updates.user;

      const task = await Task.findOneAndUpdate(
        { _id: id, user: userId },
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
  static async deleteTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.userId;

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
  static async getTaskStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId;

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
