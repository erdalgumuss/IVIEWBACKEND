import { Request, Response, NextFunction } from 'express';
import Question from '../models/Question';

// Yeni soru ekleme
export const addQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    next(error);
  }
};

// Soruları listeleme
export const listQuestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    next(error);
  }
};

// Toplu soru ekleme
export const addMultipleQuestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const questions = req.body;

  try {
    if (!Array.isArray(questions) || questions.length === 0) {
      res.status(400);
      throw new Error('Geçerli bir soru listesi gönderin');
    }

    const createdQuestions = await Question.insertMany(questions);
    res.status(201).json({
      message: 'Sorular başarıyla eklendi',
      createdQuestions,
    });
  } catch (error) {
    next(error);
  }
};

// Soru güncelleme
export const updateQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { questionText, timeLimit } = req.body;

  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      res.status(404);
      throw new Error('Soru bulunamadı');
    }

    question.questionText = questionText || question.questionText;
    question.timeLimit = timeLimit || question.timeLimit;

    await question.save();
    res.json({ message: 'Soru güncellendi', question });
  } catch (error) {
    next(error);
  }
};

// Soru silme
export const deleteQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      res.status(404);
      throw new Error('Soru bulunamadı');
    }

    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Soru silindi' });
  } catch (error) {
    next(error);
  }
};
