import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

// AWS S3 yapılandırması
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Video yükleme fonksiyonu
export const uploadVideoToS3 = async (file: Express.Multer.File): Promise<string> => {
  const uniqueFileName = `${uuidv4()}_${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;

  const s3Params = {
    Bucket: process.env.AWS_S3_BUCKET as string,
    Key: `videos/${uniqueFileName}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(s3Params);
  const result = await s3.send(command);

  if (!result || !result.ETag) {
    throw new Error('S3 video yükleme başarısız oldu');
  }

  return uniqueFileName; // Video dosya ismini döndür
};

// Presigned URL oluşturma
export const getPresignedUrl = async (videoKey: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET as string,
    Key: `videos/${videoKey}`,
  });

  const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return presignedUrl;
};
