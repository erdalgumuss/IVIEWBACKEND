import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadVideo } from '../controllers/videoController';

const router = express.Router();

// Multer ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/videos/');
  },
  filename: (req, file, cb) => {
    const candidateId = req.body.candidateId || 'unknown_candidate';
    const interviewId = req.body.interviewId || 'unknown_interview';
    const timestamp = Date.now();
    cb(null, `${candidateId}_${interviewId}_${timestamp}.mp4`);
  },
});

const upload = multer({ storage });

// Video yükleme rotası
router.post('/upload', upload.single('video'), uploadVideo);

export default router;