// ============================================
// src/controllers/intentionController.ts
// ============================================

import { Request, Response } from 'express';
import { Intention } from '../models/Intention';
import { shouldShowIntention } from '../utils/shouldShowIntention';

export class IntentionController {
  // Crear intención
  static async create(req: Request, res: Response) {
    try {
      const { title, description, recurrence } = req.body;

      const intention = await Intention.create({
        title,
        description,
        recurrence: recurrence || 'daily',
        user: req.user!.id,
      });

      res.status(201).json({
        success: true,
        data: intention,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Obtener todas las intenciones del usuario
  static async getAll(req: Request, res: Response) {
    const intentions = await Intention.find({
      user: req.user!.id,
    });

    res.json({
      success: true,
      count: intentions.length,
      data: intentions,
    });
  }

  // Intenciones para dashboard (solo las que aplican hoy)
  static async getDashboard(req: Request, res: Response) {
    const intentions = await Intention.find({
      user: req.user!.id,
      enabled: true,
    });

    const todayIntentions = [];

    for (const intention of intentions) {
      if (shouldShowIntention(intention)) {
        todayIntentions.push(intention);

        intention.lastShownAt = new Date();
        await intention.save();
      }
    }

    res.json({
      success: true,
      data: todayIntentions,
    });
  }

  // Aceptar intención
  static async accept(req: Request, res: Response) {
    const { id } = req.params;

    const intention = await Intention.findOne({
      _id: id,
      user: req.user!.id,
    });

    if (!intention) {
      return res.status(404).json({
        success: false,
        message: 'Intention not found',
      });
    }

    intention.lastAcceptedAt = new Date();
    await intention.save();

    res.json({
      success: true,
      data: intention,
    });
  }

  // Actualizar intención
  static async update(req: Request, res: Response) {
    const { id } = req.params;

    const intention = await Intention.findOneAndUpdate(
      { _id: id, user: req.user!.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!intention) {
      return res.status(404).json({
        success: false,
        message: 'Intention not found',
      });
    }

    res.json({
      success: true,
      data: intention,
    });
  }

  // Eliminar intención
  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    const intention = await Intention.findOneAndDelete({
      _id: id,
      user: req.user!.id,
    });

    if (!intention) {
      return res.status(404).json({
        success: false,
        message: 'Intention not found',
      });
    }

    res.json({
      success: true,
      message: 'Intention deleted',
    });
  }
}
