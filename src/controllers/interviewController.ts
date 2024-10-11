import { Request, Response, NextFunction } from 'express';
import Interview from '../models/Interview';

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

    if (interview.createdBy.toString() !== req.body.adminId) {
      res.status(403);
      return next(new Error('Bu mülakatı silemezsiniz'));
    }

    await interview.deleteOne();
    res.json({ message: 'Mülakat silindi' });
  } catch (error) {
    next(error);
  }
};

// Tüm mülakatları listeleme
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
