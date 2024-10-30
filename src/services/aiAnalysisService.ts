import Interview from '../models/Interview';
import Application from '../models/Application';
import { getTranscriptFromVideo } from './transcriptService'; // Transcript çıkarma fonksiyonu
import OpenAI from 'openai';

// OpenAI yapılandırması
const openai = new OpenAI({
  apiKey: "erdal"//process.env.OPENAI_API_KEY, // OpenAI API anahtarı
});

// AI Analizi başlatan fonksiyon
export const startAIAnalysis = async (applicationId: string, videoKey: string): Promise<void> => {
  try {
    // 1. Videonun transcriptini al
    const transcript = await getTranscriptFromVideo(videoKey);

    // 2. Mülakatın sorularını al
    const application = await Application.findById(applicationId).populate('interviewId');
    if (!application || !application.interviewId) {
      throw new Error('Başvuru veya mülakat bulunamadı');
    }

    const interview = await Interview.findById(application.interviewId);
    const questions = interview?.questions || [];

    // 3. OpenAI ile sorular ve transcript arasında kıyaslama yap
    const comparisonResults = await Promise.all(
      questions.map(async (question) => {
        const prompt = `
        Soru: ${question}
        Cevap: ${transcript}
        
        Lütfen soruyla cevabın ne kadar uyumlu olduğunu değerlendir ve 0-100 arasında bir puan ver.
        `;
        const response = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            { role: "system", content: "Sen deneyimli bir mülakat değerlendiricisisin." },
            { role: "user", content: prompt },
          ],
          max_tokens: 100,
        });

        // Null kontrolü yapıyoruz
        const scoreText = response.choices?.[0]?.message?.content?.trim() || "0"; // Eğer null ise "0" döner
        const score = parseFloat(scoreText); // "0" puan olarak alınacak
        return score;
      })
    );

    // 4. Ortalama puanı hesapla
    const averageScore = comparisonResults.reduce((acc, score) => acc + score, 0) / comparisonResults.length;

    // 5. Başvurudaki aiScore alanını güncelle
    application.aiScore = averageScore;
    await application.save();

    console.log(`AI analiz skoru başarıyla güncellendi: ${averageScore}`);
  } catch (error) {
    console.error('AI analiz hatası:', error);
    throw new Error('AI analizi başarısız oldu');
  }
};
