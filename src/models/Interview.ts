import mongoose, { Document, Schema } from 'mongoose';
import { IQuestion } from './Question';

// Mülakat arayüzü
export interface IInterview extends Document {
  title: string;
  questions: IQuestion[]; // Mülakata ait sorular
  createdBy: mongoose.Schema.Types.ObjectId; // Mülakatı oluşturan admin
  candidateResponses: {
    candidateId: string;
    responseVideoUrl: string;
    submittedAt: Date;
  }[];
  createdAt: Date;
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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  candidateResponses: [
    {
      candidateId: {
        type: String,
      },
      responseVideoUrl: {
        type: String,
      },
      submittedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IInterview>('Interview', InterviewSchema);
