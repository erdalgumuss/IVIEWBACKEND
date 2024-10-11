import express, { Request, Response, NextFunction } from 'express';
import Interview from '../models/Interview';
import Application from '../models/Application';

const router = express.Router();

// Mevcut mülakatları listeleme (aktif olanlar)
router.get('/interviews', async (req: Request, res: Response) => {
  try {
    // Pasif olmayan ve süresi dolmamış mülakatları getir
    const currentDate = new Date();
    const interviews = await Interview.find({ expirationDate: { $gt: currentDate } });

    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: 'Mülakatlar getirilemedi', error });
  }
});
// Başvuru yapma
router.post('/apply', async (req: Request, res: Response): Promise<void> => {
    const { name, surname, email, phoneNumber, interviewId } = req.body;
  
    try {
      // Başvuru yapılan mülakatın var olup olmadığını kontrol et
      const interview = await Interview.findById(interviewId);
      if (!interview) {
        res.status(404).json({ message: 'Seçilen mülakat bulunamadı' });
        return;
      }
  
      // Yeni başvuru oluştur
      const application = new Application({
        name,
        surname,
        email,
        phoneNumber,
        interviewId,
      });
  
      await application.save();
      res.status(201).json({ message: 'Başvuru başarıyla kaydedildi', application });
    } catch (error) {
      res.status(500).json({ message: 'Başvuru kaydedilemedi', error });
    }
  });
  
// Tüm başvuruları listeleme (Admin için)
router.get('/applications', async (req: Request, res: Response) => {
    try {
      const applications = await Application.find().populate('interviewId', 'title');
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: 'Başvurular getirilemedi', error });
    }
  });

// Başvuru onaylama (durumu "Onaylandı" olarak değiştir)
router.put('/approve/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    // Belirtilen başvuruyu bul ve güncelle
    const application = await Application.findById(req.params.id);
    if (!application) {
      res.status(404).json({ message: 'Başvuru bulunamadı' });
      return;
    }

    // Durumu "Onaylandı" olarak değiştir
    application.status = 'Onaylandı';
    await application.save();

    res.json({ message: 'Başvuru onaylandı', application });
  } catch (error) {
    res.status(500).json({ message: 'Başvuru onaylanamadı', error });
  }
});
// Başvuru reddetme (durumu "Reddedildi" olarak değiştir)
router.put('/reject/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Belirtilen başvuruyu bul ve güncelle
      const application = await Application.findById(req.params.id);
      if (!application) {
        res.status(404).json({ message: 'Başvuru bulunamadı' });
        return;
      }
  
      // Durumu "Reddedildi" olarak değiştir
      application.status = 'Reddedildi';
      await application.save();
  
      res.json({ message: 'Başvuru reddedildi', application });
    } catch (error) {
      next(error); // Hataları `next` fonksiyonu ile üst middleware'e iletelim
    }
  });
  
export default router;
