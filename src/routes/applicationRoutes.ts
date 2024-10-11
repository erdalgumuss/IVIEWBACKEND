import express from 'express';
import {
  listActiveInterviews,
  applyForInterview,
  listApplications,
  approveApplication,
  rejectApplication,
} from '../controllers/applicationController';

const router = express.Router();

// Mevcut mülakatları listeleme
router.get('/interviews', listActiveInterviews);

// Başvuru yapma
router.post('/apply', applyForInterview);

// Tüm başvuruları listeleme
router.get('/applications', listApplications);

// Başvuru onaylama
router.put('/approve/:id', approveApplication);

// Başvuru reddetme
router.put('/reject/:id', rejectApplication);

export default router;
