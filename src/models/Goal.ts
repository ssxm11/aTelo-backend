// ============================================
// src/models/Goal.ts - Modelo de Goal
// ============================================

import { Schema, model, Types, Document } from 'mongoose';

export interface IGoal extends Document {
  title: string;
  description?: string;
  user: Types.ObjectId;
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
  },
  { timestamps: true }
);

export const Goal = model<IGoal>('Goal', goalSchema);
