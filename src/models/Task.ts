// ============================================
// src/models/Task.ts - Modelo de Task
// ============================================
import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'in_progress', 'completed', 'cancelled'],
        message: '{VALUE} is not a valid status'
      },
      default: 'pending'
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'urgent'],
        message: '{VALUE} is not a valid priority'
      },
      default: 'medium'
    },
    dueDate: {
      type: Date,
      validate: {
        validator: function(value: Date) {
          return !value || value > new Date();
        },
        message: 'Due date must be in the future'
      }
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Índice compuesto para mejorar consultas por usuario y estado
taskSchema.index({ user: 1, status: 1 });

// Índice para búsqueda por fecha de vencimiento
taskSchema.index({ dueDate: 1 });

// Virtual para verificar si la tarea está vencida
taskSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || this.status === 'completed' || this.status === 'cancelled') {
    return false;
  }
  return this.dueDate < new Date();
});

// Middleware para evitar actualizar tareas canceladas
taskSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'cancelled') {
    // Una vez cancelada, no se puede cambiar el estado
    const originalStatus = (this as any)._original?.status;
    if (originalStatus === 'cancelled' && this.status !== 'cancelled') {
      return next(new Error('Cannot modify a cancelled task'));
    }
  }
  next();
});

export const Task = mongoose.model<ITask>('Task', taskSchema);