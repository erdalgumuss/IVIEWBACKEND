import express from 'express';
import { loginAdmin } from '../controllers/adminController';

const router = express.Router();

// Admin giriş rotası
router.post('/login', loginAdmin);

export default router;
