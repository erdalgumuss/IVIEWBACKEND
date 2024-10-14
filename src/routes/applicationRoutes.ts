import express from 'express';
import {
  listActiveInterviews,
  applyForInterview,
  listApplications,
  approveApplication,
  rejectApplication,
  applicationsByInterview,
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

// Mülakata bağlı başvuruları listeleme
router.get('/interview/:interviewId/applications', applicationsByInterview);


export default router;
