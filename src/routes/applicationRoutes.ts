import express from 'express';
import {
  listActiveInterviews,
  applyForInterview,
  listApplications,
  //approveApplication,
  //rejectApplication,
  updateApplicationStatusWithAdminNote,
  applicationsByInterview,
  getInterviewByLink,
  countApplicationsByInterview
 // addVideoKeyToApplication,
} from '../controllers/applicationController';

const router = express.Router();

// Mevcut mülakatları listeleme
router.get('/interviews', listActiveInterviews);

// Benzersiz link ile mülakat bilgisi getirme (GET isteği)
router.get('/apply/:uniqueId', getInterviewByLink);

// Kişi bilgilerinin Submit edilmesi
router.post('/appadd', applyForInterview);

// Tüm başvuruları listeleme
router.get('/applications', listApplications);

// Başvuru onaylama
//router.put('/approve/:id', approveApplication);

// Başvuru reddetme
//router.put('/reject/:id', rejectApplication);

// Admin notunu ve durumu güncelleme rotası
router.put('/:id/update-status', updateApplicationStatusWithAdminNote);


// Başvuru sayısını alma rotası
router.get('/interview/:interviewId/count', countApplicationsByInterview); // Yeni rota


// Mülakata bağlı başvuruları listeleme
router.get('/interview/:interviewId/applications', applicationsByInterview);

// Video URL ekleme rotası (başvuruya ekleme)
//router.put('/application/:applicationId/video', addVideoKeyToApplication); // Video URL ekleme rotası


export default router;
