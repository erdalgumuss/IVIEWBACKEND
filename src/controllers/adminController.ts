import { Request, Response } from 'express';
import Admin from '../models/Admin';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Admin giriş işlemi
export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    console.log('Gelen kullanıcı adı:', username); // Debug için eklendi
    console.log('Gelen şifre:', password); // Debug için eklendi

    // Admin'i bul
    const adminName = process.env.ADMIN_USERNAME
    const adminPsw = process.env.ADMIN_PASSWORD
    if (adminName != username || password != adminPsw) {
      console.log('Admin bulunamadı.'); // Debug için eklendi
      res.status(404).json({ message: 'Geçersiz kullanıcı adı' });
      return;
    }


    

    // JWT token oluştur
    const token = jwt.sign({ name: adminName }, process.env.JWT_SECRET as string, {
      expiresIn: '1h', // Token geçerlilik süresi
    });

    res.json({ token, message: 'Başarılı giriş' });
  } catch (error) {
    console.error('Sunucu hatası:', error); // Debug için eklendi
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};
// Admin çıkış işlemi
export const logoutAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json({ message: 'Başarılı çıkış' }); // Sadece mesaj döndürür
  } catch (error) {
    console.error('Sunucu hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};
