import express from 'express';
import { loginAdmin, logoutAdmin } from '../controllers/adminController'; // Çıkış fonksiyonunu ekledik

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin); // Çıkış rotası

export default router;
