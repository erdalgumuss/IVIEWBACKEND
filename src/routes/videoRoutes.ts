import express from 'express';
import multer from 'multer';
import { uploadVideo } from '../controllers/videoController';

const router = express.Router();

// Multer ayarları (dosyayı bellekte tut)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Video yükleme rotası
router.post('/upload', upload.single('video'), uploadVideo);

export default router;
