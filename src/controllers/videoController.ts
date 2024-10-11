import { Request, Response } from 'express';

// Video yükleme
export const uploadVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const videoUrl = req.file?.path;
    res.status(201).json({ message: 'Video başarıyla yüklendi', videoUrl });
  } catch (error) {
    res.status(500).json({ message: 'Video yüklenemedi', error });
  }
};
