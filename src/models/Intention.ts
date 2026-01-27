// ============================================
// src/models/Intention.ts - Modelo de Intention
// ============================================

import { Schema, model, Types, Document } from 'mongoose';

export interface IIntention extends Document {
  title: string;
  description?: string;
  user: Types.ObjectId;

  recurrence: 'daily' | 'weekly';

  enabled: boolean;

  lastShownAt?: Date;
  lastAcceptedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const intentionSchema = new Schema<IIntention>(
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

    recurrence: {
      type: String,
      enum: ['daily', 'weekly'],
      default: 'daily',
    },

    enabled: {
      type: Boolean,
      default: true,
    },

    lastShownAt: {
      type: Date,
    },

    lastAcceptedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Intention = model<IIntention>(
  'Intention',
  intentionSchema
);
