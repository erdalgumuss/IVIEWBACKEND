import { Request, Response, NextFunction } from 'express';
import Interview from '../models/Interview';
import Application from '../models/Application';

// Mevcut mülakatları listeleme (aktif olanlar)
export const listActiveInterviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentDate = new Date();
    const interviews = await Interview.find({ expirationDate: { $gt: currentDate } });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: 'Mülakatlar getirilemedi', error });
  }
};
// Benzersiz link ile mülakat bilgisi getirme
export const getInterviewByLink = async (req: Request, res: Response): Promise<void> => {
  const { uniqueId } = req.params; // URL'den uniqueId'yi alıyoruz

  try {
    const interview = await Interview.findOne({ link: `http://localhost:5174/apply/${uniqueId}` });

    if (!interview) {
      res.status(404).json({ message: 'Mülakat bulunamadı' });
      return;
    }

    // Başvuru sayfasına gerekli mülakat bilgilerini gönder
    res.status(200).json(interview);
  } catch (error) {
    res.status(500).json({ message: 'Mülakat getirilemedi', error });
  }
};

// Başvuru yapma
export const applyForInterview = async (req: Request, res: Response): Promise<void> => {
  const { name, surname, email, phoneNumber, interviewId } = req.body;

  try {
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      res.status(404).json({ message: 'Seçilen mülakat bulunamadı' });
      return;
    }

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
};

// Tüm başvuruları listeleme (Admin için)
export const listApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const applications = await Application.find().populate('interviewId', 'title');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Başvurular getirilemedi', error });
  }
};

// Başvuru onaylama
export const approveApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      res.status(404).json({ message: 'Başvuru bulunamadı' });
      return;
    }

    application.status = 'Onaylandı';
    await application.save();

    res.json({ message: 'Başvuru onaylandı', application });
  } catch (error) {
    res.status(500).json({ message: 'Başvuru onaylanamadı', error });
  }
};

// Başvuru reddetme
export const rejectApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      res.status(404).json({ message: 'Başvuru bulunamadı' });
      return;
    }

    application.status = 'Reddedildi';
    await application.save();

    res.json({ message: 'Başvuru reddedildi', application });
  } catch (error) {
    next(error);
  }
};
// Bir mülakata bağlı başvuruları listeleme
export const applicationsByInterview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { interviewId } = req.params;

  try {
    // Mülakata bağlı başvuruları bul
    const applications = await Application.find({ interviewId }).populate('interviewId', 'title');

    if (!applications || applications.length === 0) {
      res.status(404).json({ message: 'Bu mülakata bağlı başvuru bulunamadı' });
      return;
    }

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Başvurular getirilemedi', error });
  }
};
