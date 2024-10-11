import express from 'express';
import auth from '../middlewares/auth';
import {
  addQuestion,
  listQuestions,
  addMultipleQuestions,
  updateQuestion,
  deleteQuestion,
} from '../controllers/questionController';

const router = express.Router();

// Rotalar
router.post('/add', auth, addQuestion);
router.get('/list', auth, listQuestions);
router.post('/add-multiple', auth, addMultipleQuestions);
router.put('/update/:id', auth, updateQuestion);
router.delete('/delete/:id', auth, deleteQuestion);

export default router;
