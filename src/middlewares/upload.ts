import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';

// Multer ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/videos'); // Video dosyalarının saklanacağı klasör
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname); // Benzersiz dosya adı
  },
});

// Sadece video dosyalarını kabul etme
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  // Kabul edilen video türleri
  const fileTypes = /mp4|mov|avi|mkv|webm/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); // Dosya kabul ediliyor
  } else {
    cb(new Error('Sadece video dosyaları yüklenebilir.')); // Hata mesajı
  }
};

// Multer yapılandırması
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // Maksimum dosya boyutu: 100 MB (bytes)
});

export default upload;
