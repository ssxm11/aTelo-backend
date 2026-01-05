// ============================================
// src/models/Goal.ts - Modelo de Goal
// ============================================

import { Schema, model, Types, Document } from 'mongoose';

export interface IGoal extends Document {
  title: string;
  description?: string;
  user: Types.ObjectId;
  type: 'goal' | 'intention';
  intention: {
    enabled: boolean;
    recurrence: 'daily' | 'weekly';
    lastShownAt?: Date;
    lastAcceptedAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const goalSchema = new Schema<IGoal>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    description: {
      type: String,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['goal', 'intention'],
      default: 'goal'
    },

    intention: {
      enabled: { type: Boolean, default: false },

      recurrence: {
        type: String,
        enum: ['daily', 'weekly'],
        default: 'daily'
      },

      lastShownAt: { type: Date },
      lastAcceptedAt: { type: Date }
    }
  },
  { timestamps: true }
);

export const Goal = model<IGoal>('Goal', goalSchema);
