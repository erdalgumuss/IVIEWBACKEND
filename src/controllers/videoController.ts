import { Request, Response } from 'express';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import Application from '../models/Application';
//import { startAIAnalysis } from '../services/aiAnalysisService'; // AI analiz servisini import ediyoruz

// AWS S3 yapılandırması
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Video yükleme fonksiyonu
export const uploadVideo = async (req: Request, res: Response): Promise<void> => {
  const { applicationId } = req.body; // Başvuru ID'sini alıyoruz

  try {
    // S3 bucket kontrolü
    if (!process.env.AWS_S3_BUCKET) {
      res.status(500).json({ message: 'S3 Bucket is not defined in environment variables' });
      return;
    }

    // Multer tarafından yüklenen dosya kontrolü
    const file = req.file;
    if (!file) {
      res.status(400).json({ message: 'Video dosyası yüklenemedi' });
      return;
    }

    // Benzersiz dosya adı için UUID kullanıyoruz
    const uniqueFileName = `${uuidv4()}_${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;

    // S3'e video yükleme parametreleri
    const s3Params = {
      Bucket: process.env.AWS_S3_BUCKET as string,
      Key: `videos/${uniqueFileName}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    // S3'e yükleme işlemi
    const command = new PutObjectCommand(s3Params);
    const result = await s3.send(command);

    // Yükleme doğrulama
    if (!result || !result.ETag) {
      throw new Error('S3 video yükleme başarısız oldu');
    }

    // Video key'i (dosya ismi) alıyoruz
    const videoKey = uniqueFileName;

    // Başvuruya video key'ini kaydediyoruz
    const application = await Application.findById(applicationId);
    if (application) {
      application.videoUrl = videoKey;  // Video URL yerine video key kaydediyoruz
      await application.save(); // Başvurunun video key'ini kaydet
    } else {
      res.status(404).json({ message: 'Başvuru bulunamadı' });
      return;
    }

    // AI analizini başlatıyoruz
   // await startAIAnalysis(applicationId, videoKey);

    // Başarılı yanıt
    res.status(201).json({ message: 'Video başarıyla yüklendi, AI analizi başlatıldı', videoKey });
  } catch (error) {
    console.error('Video yükleme hatası:', error);
    res.status(500).json({ message: 'Video yükleme hatası', error });
  }
};

// Presigned URL oluşturma fonksiyonu
export const getVideoPresignedUrl = async (req: Request, res: Response): Promise<void> => {
  const { videoKey } = req.params; // Video dosyasının key'ini (path) alıyoruz

  try {
    // S3 presigned URL oluşturma işlemi
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET as string,
      Key: `videos/${videoKey}`, // Video dosyasının tam key'i
    });

    // Presigned URL'i oluşturuyoruz (örneğin 1 saat geçerli, süreyi isterseniz artırabilirsiniz)
    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    res.status(200).json({ presignedUrl });
  } catch (error) {
    console.error('Presigned URL oluşturulamadı:', error);
    res.status(500).json({ message: 'Presigned URL oluşturulamadı', error });
  }
};
