// ============================================
// src/controllers/goalController.ts - Controlador de Goals
// ============================================
import { Request, Response } from 'express';
import { Goal } from '../models/Goal';

export class GoalController {
  // Crear goal
  static async createGoal(req: Request, res: Response) {
    try {
      const { title, description } = req.body;

      const goal = await Goal.create({
        title,
        description,
        user: req.user!.id,
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

    res.json({
      success: true,
      count: goals.length,
      data: goals,
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
}
