import mongoose, { Document, Schema } from 'mongoose';

// Soru arayüzü
export interface IQuestion extends Document {
  questionText: string;
  timeLimit: number; // Soru için ayrılan süre (saniye olarak)
  topic: string; // Sorunun konusu
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
  topic: {
    type: String,
    required: true, // Konu alanı zorunlu hale getirilmiştir
  },
});

export default mongoose.model<IQuestion>('Question', QuestionSchema);
