import { Request, Response, NextFunction } from 'express';
import Interview from '../models/Interview';
import { v4 as uuidv4 } from 'uuid'; // UUID kullanarak benzersiz bir kimlik oluşturacağız
import { isNullOrUndefined } from 'util';
import { devNull } from 'os';

// Yeni mülakat oluşturma
export const createInterview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { title, questions, expirationDate } = req.body;

  try {
    const interview = new Interview({
      title,
      questions,
      expirationDate,
      createdBy: req.body.adminId,
    });

    await interview.save();
    res.status(201).json({ message: 'Mülakat başarıyla oluşturuldu', interview });
  } catch (error) {
    next(error);
  }
};

// Mülakat güncelleme
export const updateInterview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    next(error);
  }
};

// Mülakat silme
export const deleteInterview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      res.status(404);
      return next(new Error('Mülakat bulunamadı'));
    }

    // if (interview.createdBy.toString() !== req.body.adminId) {
    //   res.status(403);
    //   return next(new Error('Bu mülakatı silemezsiniz'));
    // }

    await interview.deleteOne();
    res.json({ message: 'Mülakat silindi' });
  } catch (error) {
    next(error);
  }
};

// Tüm oluşturduğumuz mülakatları listeleme
export const listInterviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const interviews = await Interview.find({ createdBy: req.body.adminId });
    res.json(interviews);
  } catch (error) {
    next(error);
  }
};

// Mülakat başlatma ve soruları sırayla gösterme
export const startInterview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const interviewId = req.params.interviewId;
    const interview = await Interview.findById(interviewId).populate('questions');

    if (!interview) {
      res.status(404);
      return next(new Error('Mülakat bulunamadı'));
    }

    res.json(interview.questions);
  } catch (error) {
    next(error);
  }
};

// Mülakatı yayınla/yayından kaldır
// Mülakatı yayınla/yayından kaldır
export const publishInterview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { published } = req.body;

  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      res.status(404).json({ message: 'Mülakat bulunamadı' });
      return;
    }

    // Yayın durumunu güncelle
    interview.published = published;

    // Mülakat yayınlandığında yeni bir başvuru uniqueId oluştur
    if (published) {
      const uniqueId = uuidv4(); // Benzersiz bir kimlik oluştur

      const baseUrl = process.env.BASE_URL || 'http://localhost:5174'; // Uygulamanın ana URL'si (örn. frontend URL)
      interview.link = `${baseUrl}/apply/${uniqueId}`; // Yeni link oluştur
    } else {
      // Yayından kaldırıldığında linki temizle
      interview.link = null;
    }

    await interview.save();
    res.json({
      message: `Mülakat ${published ? 'yayınlandı' : 'yayından kaldırıldı'}`,
      interview,
    });
  } catch (error) {
    next(error);
  }
};



// Yalnızca yayınlanmış mülakatları listeleme
export const listPublishedInterviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const interviews = await Interview.find({ published: true });
        res.json(interviews);
    } catch (error) {
        res.status(500).json({ message: 'Yayınlanmış mülakatlar getirilemedi', error });
    }
};