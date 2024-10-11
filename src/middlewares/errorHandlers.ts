import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Hata:', err.message || err);

  // Hata türüne göre durum kodunu belirleyelim
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message || 'Sunucu hatası',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Üretim ortamında stack trace göstermeyin
  });
};

export default errorHandler;
