import { Request, Response } from 'express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid'; // Benzersiz bir ID oluşturmak için

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

    // Benzersiz bir dosya adı için UUID kullanıyoruz
    const uniqueFileName = `${uuidv4()}_${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;

    // S3 parametreleri (dosya bellekte tutuluyor, bu yüzden buffer kullanıyoruz)
    const s3Params = {
      Bucket: process.env.AWS_S3_BUCKET as string,
      Key: `videos/${uniqueFileName}`,
      Body: file.buffer, // Burada `file.buffer` kullanıyoruz çünkü dosya bellekte tutuluyor
      ContentType: file.mimetype, // Dosya tipini belirtiyoruz
    };

    // S3'e video yükleme işlemi
    const command = new PutObjectCommand(s3Params);
    const result = await s3.send(command);  // AWS SDK v3'ün yeni yöntemi

    if (!result || !result.ETag) {  // ETag, başarılı yüklemeyi doğrulamak için kullanılabilir
      throw new Error('S3 video yükleme başarısız oldu');
    }

    // Yüklenen dosyanın S3 URL'si
    const videoUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/videos/${uniqueFileName}`;

    // Yükleme başarılıysa yanıt dön
    res.status(201).json({ message: 'Video başarıyla yüklendi', videoUrl });
  } catch (error) {
    
    console.error('Video yükleme hatası:', error);
    res.status(500).json({ message: 'Video yükleme hatası', error });
  }
};
