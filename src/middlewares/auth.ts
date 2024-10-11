import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const auth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401);
    return next(new Error('Erişim reddedildi, token yok veya hatalı format'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.body.adminId = (decoded as any).id;
    next();
  } catch (error) {
    res.status(401);
    return next(new Error('Geçersiz token'));
  }
};

export default auth;
