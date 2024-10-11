import express, { Request, Response, NextFunction } from 'express';
import Question from '../models/Question';
import auth from '../middlewares/auth';

const router = express.Router();

// Yeni soru ekleme
router.post('/add', auth, async (req: Request, res: Response, next: NextFunction) => {
  const { questionText, timeLimit } = req.body;

  try {
    if (!questionText || !timeLimit) {
      res.status(400);
      throw new Error('Soru metni ve süre gereklidir');
    }

    const question = new Question({
      questionText,
      timeLimit,
    });

    await question.save();
    res.status(201).json({ message: 'Soru başarıyla eklendi', question });
  } catch (error) {
    next(error); // Hata yönetimi middleware'ine iletiliyor
  }
});

// Soruları listeleme
router.get('/list', auth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    next(error); // Hata yönetimi middleware'ine iletiliyor
  }
});

// Toplu soru ekleme
router.post('/add-multiple', auth, async (req: Request, res: Response, next: NextFunction) => {
  const questions = req.body;

  try {
    if (!Array.isArray(questions) || questions.length === 0) {
      res.status(400);
      throw new Error('Geçerli bir soru listesi gönderin');
    }

    // Tüm soruları veritabanına kaydetme
    const createdQuestions = await Question.insertMany(questions);

    res.status(201).json({
      message: 'Sorular başarıyla eklendi',
      createdQuestions,
    });
  } catch (error) {
    next(error); // Hata yönetimi middleware'ine iletiliyor
  }
});

// Soru güncelleme
router.put('/update/:id', auth, async (req: Request, res: Response, next: NextFunction) => {
  const { questionText, timeLimit } = req.body;

  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      res.status(404);
      throw new Error('Soru bulunamadı');
    }

    // Soruyu güncelle
    question.questionText = questionText || question.questionText;
    question.timeLimit = timeLimit || question.timeLimit;

    await question.save();
    res.json({ message: 'Soru güncellendi', question });
  } catch (error) {
    next(error); // Hata yönetimi middleware'ine iletiliyor
  }
});

// Soru silme
router.delete('/delete/:id', auth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      res.status(404);
      throw new Error('Soru bulunamadı');
    }

    // Soru silme işlemi için deleteOne yerine findByIdAndDelete kullanıyoruz
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Soru silindi' });
  } catch (error) {
    next(error); // Hata yönetimi middleware'ine iletiliyor
  }
});


export default router;
