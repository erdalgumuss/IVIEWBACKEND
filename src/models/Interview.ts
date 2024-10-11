import mongoose, { Document, Schema } from 'mongoose';

// Mülakat arayüzü
export interface IInterview extends Document {
  title: string;
  questions: mongoose.Schema.Types.ObjectId[]; // Soruların ID'leri
  createdAt: Date;
  expirationDate: Date; // Mülakatın pasif olma tarihi
  createdBy: mongoose.Schema.Types.ObjectId; // Bu alanı ekleyin
}

const InterviewSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now, // Oluşturulma tarihi
  },
  expirationDate: {
    type: Date,
    required: true, // Admin tarafından girilecek
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
});

export default mongoose.model<IInterview>('Interview', InterviewSchema);
