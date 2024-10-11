import express, { Request, Response, NextFunction } from 'express';
import Interview from '../models/Interview';
import auth from '../middlewares/auth';

const router = express.Router();

// Yeni mülakat oluşturma
router.post('/create', auth, async (req: Request, res: Response, next: NextFunction) => {
  const { title, questions } = req.body;

  try {
    // Girdi doğrulama
    if (!title || !questions) {
      res.status(400); // 400 Bad Request
      throw new Error('Başlık ve sorular gereklidir');
    }

    const interview = new Interview({
      title,
      questions,
      createdBy: req.body.adminId,
    });

    await interview.save();
    res.status(201).json({ message: 'Mülakat başarıyla oluşturuldu', interview });
  } catch (error) {
    next(error); // Hata yönetimi middleware'ine iletiliyor
  }
});

// Mülakat güncelleme
router.put('/update/:id', auth, async (req: Request, res: Response, next: NextFunction) => {
  const { title, questions } = req.body;

  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      res.status(404); // 404 Not Found
      throw new Error('Mülakat bulunamadı');
    }

    // Yalnızca mülakatı oluşturan admin güncelleyebilir
    if (interview.createdBy.toString() !== req.body.adminId) {
      res.status(403); // 403 Forbidden
      throw new Error('Bu mülakatı güncelleyemezsiniz');
    }

    interview.title = title || interview.title;
    interview.questions = questions || interview.questions;

    await interview.save();
    res.json({ message: 'Mülakat güncellendi', interview });
  } catch (error) {
    next(error);
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
// Tüm mülakatları listeleme
router.get('/list', auth, async (req: Request, res: Response) => {
  try {
    // Admin tarafından oluşturulan tüm mülakatları bul
    const interviews = await Interview.find({ createdBy: req.body.adminId });

    // Hiç mülakat bulunamadıysa bir mesaj döndür
    if (!interviews || interviews.length === 0) {
      return res.status(404).json({ message: 'Hiç mülakat bulunamadı.' });
    }

    // Mülakatları JSON formatında döndür
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: 'Mülakatlar getirilemedi', error });
  }
});


export default router;
