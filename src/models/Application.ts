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
  adminNote?: string; // Admin tarafından verilen not
  aiScore?: number; // AI tarafından verilen puan (0-100 arasında)
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
  adminNote: {
    type: String, // Adminin başvuruya ekleyeceği not
  },
  aiScore: {
    type: Number, // AI tarafından verilecek puan
    min: 0,
    max: 100,
    default: null, // AI puanı başlangıçta boş bırakılabilir
  },
});

export default mongoose.model<IApplication>('Application', ApplicationSchema);
