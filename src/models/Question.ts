import mongoose, { Document, Schema } from 'mongoose';

// Soru arayüzü
export interface IQuestion extends Document {
  questionText: string;
  timeLimit: number; // Soru için ayrılan süre (saniye olarak)
}

const QuestionSchema: Schema = new Schema({
  questionText: {
    type: String,
    required: true,
  },
  timeLimit: {
    type: Number,
    required: false,
    default: 60, // Varsayılan süre 60 saniye
  },
});

export default mongoose.model<IQuestion>('Question', QuestionSchema);
