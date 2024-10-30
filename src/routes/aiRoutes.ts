import express from 'express';
import { triggerAIAnalysis } from '../controllers/aiAnalysisController';

const router = express.Router();

// AI Analizi tetikleme rotası
router.post('/trigger-ai-analysis', triggerAIAnalysis);

export default router;
