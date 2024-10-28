import mongoose, { Document, Schema } from 'mongoose';

// Başvuru arayüzü
export interface IApplication extends Document {
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  interviewId: mongoose.Schema.Types.ObjectId;
  videoUrl?: string;
  appliedAt: Date;
  status: string; // Güncellenmiş durum alanı
  consent: boolean; // Kullanıcı sözleşmesi onayı
}

const ApplicationSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true,
  },
  videoUrl: {
    type: String,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Beklemede', 'Onaylandı', 'Reddedildi'],
    default: 'Beklemede',
  },
  consent: {
    type: Boolean,
    required: true, // Kullanıcının onayı gerekli
  },
});

export default mongoose.model<IApplication>('Application', ApplicationSchema);
