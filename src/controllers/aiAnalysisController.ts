import { Request, Response } from 'express';
import Application from '../models/Application';
import { startAIAnalysis } from '../services/aiAnalysisService'; // AI analiz servisini import ediyoruz

// Başvuru videosu yüklendikten sonra AI analiz işlemini başlatan fonksiyon
export const triggerAIAnalysis = async (req: Request, res: Response): Promise<void> => {
  const { applicationId, videoKey } = req.body; // Başvuru ID'si ve video key'i alıyoruz

  try {
    // Başvuruyu bul
    const application = await Application.findById(applicationId);
    if (!application) {
      res.status(404).json({ message: 'Başvuru bulunamadı' });
      return;
    }

    // AI analizini başlatıyoruz
    await startAIAnalysis(applicationId, videoKey);

    // Başarılı yanıt dön
    res.status(200).json({ message: 'AI analizi başarıyla başlatıldı.' });
  } catch (error) {
    console.error('AI analizi başlatılamadı:', error);
    res.status(500).json({ message: 'AI analizi başlatılamadı', error });
  }
};
