import express, { Application } from 'express';
import connectDB from './config/db';
import adminRoutes from './routes/adminRoutes';
import interviewRoutes from './routes/interviewRoutes';
import questionRoutes from './routes/questionRoutes'; // Soru rotasını doğru şekilde ekleyin
import applicationRoutes from './routes/applicationRoutes';
import errorHandler from './middlewares/errorHandlers'; // Hata yönetimi middleware'i
import videoRoutes from './routes/videoRoutes';


const app: Application = express();
const PORT = process.env.PORT || 5000;

// Veritabanı bağlantısı
connectDB();

// Middleware'ler
app.use(express.json()); // JSON verisi işlemek için gerekli middleware

// Rotalar
app.use('/api/admin', adminRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/question', questionRoutes); // /api/question yönlendirmesi
app.use('/api/application', applicationRoutes);
app.use('/api/video', videoRoutes);



// Genel hata yönetimi middleware'i
app.use(errorHandler);

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} numaralı portta çalışıyor.`);
});
app.use('/api/application', applicationRoutes);
app.use('/api/video', videoRoutes);



//    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MDhkOGIzZjU3NmYzOTcwMTk2NDAzMyIsImlhdCI6MTcyODYzOTAxOSwiZXhwIjoxNzI4NjQyNjE5fQ.zgO1zm74oM4L2wNQU-pcBi7ndDHBwyzbdPk6crlHpsQ",
//    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MDhkOGIzZjU3NmYzOTcwMTk2NDAzMyIsImlhdCI6MTcyODY0MDg5OCwiZXhwIjoxNzI4NjQ0NDk4fQ.Vsl38bQelqT-hmZsKH0KvlAbe6F-SYfcnilFHJ52Uqw",
