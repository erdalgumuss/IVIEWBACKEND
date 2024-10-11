import multer from 'multer';
import path from 'path';

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
const fileFilter = (req: any, file: any, cb: any) => {
  const fileTypes = /mp4|mov|avi|mkv/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Sadece video dosyaları yüklenebilir.'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 100000000 }, // Maksimum dosya boyutu: 100 MB
});

export default upload;
