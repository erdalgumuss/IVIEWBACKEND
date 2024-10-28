import dotenv from 'dotenv';
dotenv.config(); // Çevresel değişkenlerin yüklendiğinden emin olmak için en başta çalıştır

import express, { Application } from 'express';
import cors from 'cors';
import connectDB from './config/db';
import adminRoutes from './routes/adminRoutes';
import interviewRoutes from './routes/interviewRoutes';
import questionRoutes from './routes/questionRoutes';
import applicationRoutes from './routes/applicationRoutes';
import videoRoutes from './routes/videoRoutes';
import categoryRoutes from './routes/categoryRoutes';
import errorHandler from './middlewares/errorHandlers';

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Veritabanı bağlantısı
connectDB();

// Middleware'ler
app.use(cors());
app.use(express.json());

// Rotalar
app.use('/api/admin', adminRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/question', questionRoutes);
app.use('/api/application', applicationRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/category', categoryRoutes);

// Genel hata yönetimi middleware'i
app.use(errorHandler);

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} numaralı portta çalışıyor.`);
});
