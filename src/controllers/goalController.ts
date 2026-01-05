// ============================================
// src/controllers/goalController.ts - Controlador de Goals
// ============================================
import { Request, Response } from 'express';
import { Goal } from '../models/Goal';
import { Task } from '../models/Task';
import { shouldShowIntention } from '../utils/intentions';

export class GoalController {
  // Crear goal
  static async createGoal(req: Request, res: Response) {
    try {
      const { title, description , type, intention} = req.body;

      const goal = await Goal.create({
        title,
        description,
        type: type || 'goal',
        user: req.user!.id,
        intention:
        type === 'intention'
          ? {
              enabled: true,
              recurrence: intention?.recurrence || 'daily',
            }
          : undefined,
      });

      res.status(201).json({
        success: true,
        data: goal,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error creating goal',
      });
    }
  }

  // Obtener todas las goals del usuario
  static async getGoals(req: Request, res: Response) {
  const goals = await Goal.find({ user: req.user!.id });

  const goalsWithProgress = await Promise.all(
    goals.map(async goal => {
      const totalTasks = await Task.countDocuments({
        goal: goal._id,
      });

      const completedTasks = await Task.countDocuments({
        goal: goal._id,
        status: 'completed',
      });

      const progress =
        totalTasks > 0
          ? completedTasks / totalTasks
          : null;

      return {
        ...goal.toObject(),
        progress,
      };
    })
  );

  res.json({
    success: true,
    count: goalsWithProgress.length,
    data: goalsWithProgress,
  });
}

  // Obtener una goal por ID
  static async getGoalById(req: Request, res: Response) {
    const { id } = req.params;

    const goal = await Goal.findOne({
      _id: id,
      user: req.user!.id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found',
      });
    }

    res.json({
      success: true,
      data: goal,
    });
  }

  // Actualizar goal
  static async updateGoal(req: Request, res: Response) {
    const { id } = req.params;

    const goal = await Goal.findOneAndUpdate(
      { _id: id, user: req.user!.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found',
      });
    }

    res.json({
      success: true,
      data: goal,
    });
  }

  // Eliminar goal
  static async deleteGoal(req: Request, res: Response) {
    const { id } = req.params;

    const goal = await Goal.findOneAndDelete({
      _id: id,
      user: req.user!.id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found',
      });
    }

    res.json({
      success: true,
      message: 'Goal deleted successfully',
    });
  }
  static async getDashboardGoals(req: Request, res: Response) {
  const userId = req.user!.id;

  const goals = await Goal.find({ user: userId });

  const tasksGoals = [];
  const intentions = [];

  for (const goal of goals) {
    if (goal.type === 'intention') {
      if (shouldShowIntention(goal)) {
        intentions.push(goal);

        // marcar que se mostró (no es aceptar)
        goal.intention.lastShownAt = new Date();
        await goal.save();
      }
    } else {
      tasksGoals.push(goal);
    }
  }

  res.json({
    success: true,
    data: {
      goals: tasksGoals,
      intentions
    }
  });
}
}
