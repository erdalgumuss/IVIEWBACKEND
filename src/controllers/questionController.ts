import { Request, Response, NextFunction } from 'express';
import Question from '../models/Question';

// Yeni soru ekleme
export const addQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { questionText, timeLimit, topic } = req.body;

  try {
    if (!questionText || !topic) {
      res.status(400);
      throw new Error('Soru metni ve konu gereklidir');
    }

    const question = new Question({
      questionText,
      timeLimit: timeLimit || 60, // Eğer süre belirtilmemişse varsayılan olarak 60 saniye
      topic,
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

    // Her soruda topic alanının olup olmadığını kontrol et
    for (const question of questions) {
      if (!question.topic) {
        res.status(400);
        throw new Error('Tüm sorularda "topic" alanı zorunludur');
      }
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
  const { questionText, timeLimit, topic } = req.body;

  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      res.status(404);
      throw new Error('Soru bulunamadı');
    }

    // Soruyu güncelle
    question.questionText = questionText || question.questionText;
    question.timeLimit = timeLimit || question.timeLimit;
    question.topic = topic || question.topic;

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

