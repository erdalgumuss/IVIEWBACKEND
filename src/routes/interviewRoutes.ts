import express from 'express';
import auth from '../middlewares/auth';
import multer from 'multer';
import {
  createInterview,
  updateInterview,
  deleteInterview,
  listInterviews,
  startInterview
} from '../controllers/interviewController';

const router = express.Router();

// Multer ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/videos/');
  },
  filename: (req, file, cb) => {
    const candidateId = req.body.candidateId;
    const interviewId = req.body.interviewId;
    const timestamp = Date.now();
    cb(null, `${candidateId}_${interviewId}_${timestamp}.mp4`);
  },
});

const upload = multer({ storage });

// Rotalar
router.post('/create', auth, createInterview);
router.put('/update/:id', auth, updateInterview);
router.delete('/delete/:id', auth, deleteInterview);
router.get('/list', auth, listInterviews);
router.get('/start/:interviewId', startInterview);

export default router;
//