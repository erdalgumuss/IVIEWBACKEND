import express, { Application } from 'express';
import cors from 'cors'; // CORS middleware'ini ekleyin
import connectDB from './config/db';
import adminRoutes from './routes/adminRoutes';
import interviewRoutes from './routes/interviewRoutes';
import questionRoutes from './routes/questionRoutes';
import applicationRoutes from './routes/applicationRoutes';
import videoRoutes from './routes/videoRoutes';
import errorHandler from './middlewares/errorHandlers'; // Hata yönetimi middleware'i
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Veritabanı bağlantısı
connectDB();

// Middleware'ler
app.use(cors()); // CORS middleware'i ekliyoruz, isteklere izin veriyoruz
app.use(express.json()); // JSON verisi işlemek için gerekli middleware

// Rotalar
app.use('/api/admin', adminRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/question', questionRoutes); 
app.use('/api/application', applicationRoutes);
app.use('/api/video', videoRoutes);

// Genel hata yönetimi middleware'i
app.use(errorHandler);

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} numaralı portta çalışıyor.`);
});
