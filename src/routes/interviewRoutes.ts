import express, { Request, Response, NextFunction } from 'express';
import Interview from '../models/Interview';
import auth from '../middlewares/auth';

const router = express.Router();

// Yeni mülakat oluşturma
router.post('/create', auth, async (req: Request, res: Response) => {
  const { title, questions, expirationDate } = req.body;

  try {
    const interview = new Interview({
      title,
      questions,
      expirationDate,
      createdBy: req.body.adminId, // Mülakatı oluşturan admin ID'si
    });

    await interview.save();
    res.status(201).json({ message: 'Mülakat başarıyla oluşturuldu', interview });
  } catch (error) {
    res.status(500).json({ message: 'Mülakat oluşturulamadı', error });
  }
});


// Mülakat güncelleme
router.put('/update/:id', auth, async (req: Request, res: Response, next: NextFunction) => {
  const { title, questions, expirationDate } = req.body;

  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      res.status(404);
      return next(new Error('Mülakat bulunamadı'));
    }

    interview.title = title || interview.title;
    interview.questions = questions || interview.questions;
    interview.expirationDate = expirationDate || interview.expirationDate;

    await interview.save();
    res.json({ message: 'Mülakat güncellendi', interview });
  } catch (error) {
    next(error); // Hata varsa, next fonksiyonu aracılığıyla hata yönetim middleware'ine iletin
  }
});


// Mülakat silme
router.delete('/delete/:id', auth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      res.status(404); // 404 Not Found
      throw new Error('Mülakat bulunamadı');
    }

    // Yalnızca mülakatı oluşturan admin silebilir
    if (interview.createdBy.toString() !== req.body.adminId) {
      res.status(403); // 403 Forbidden
      throw new Error('Bu mülakatı silemezsiniz');
    }

    await interview.deleteOne();
    res.json({ message: 'Mülakat silindi' });
  } catch (error) {
    next(error);
  }
});
// Tüm mülakatları listeleme
router.get('/list', auth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const interviews = await Interview.find({ createdBy: req.body.adminId });
    res.json(interviews);
  } catch (error) {
    next(error); // Hata oluşursa, hata yönetim middleware'ine iletin
  }
});

export default router;
