import mongoose, { Document, Schema } from 'mongoose';  
/*
CheckIn {
  userId: ObjectId
  feeling: boolean
  diagnosis: 'overwhelmed' | 'tired' | 'calm' | 'motivated' | 'foggy'
  createdAt: Date
}
*/
export interface ICheckIn extends Document {
  userId: mongoose.Types.ObjectId;
  feeling: boolean;
  diagnosis: 'overwhelmed' | 'tired' | 'calm' | 'motivated' | 'foggy';
  createdAt: Date;
}
const checkInSchema = new Schema<ICheckIn>(
  {
    userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
          index: true,
        },
    feeling: {
      type: Boolean,
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
      enum: ['overwhelmed', 'tired', 'calm', 'motivated', 'foggy']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export const CheckIn = mongoose.model<ICheckIn>('CheckIn', checkInSchema);