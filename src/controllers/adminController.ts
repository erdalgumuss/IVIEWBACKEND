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
    const admin = await Admin.findOne({ username });
    if (!admin) {
      console.log('Admin bulunamadı.'); // Debug için eklendi
      res.status(404).json({ message: 'Geçersiz kullanıcı adı' });
      return;
    }

    console.log('Veritabanından bulunan admin:', admin); // Debug için eklendi

    // Şifreyi kontrol et
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log('Şifre eşleşmedi.'); // Debug için eklendi
      res.status(401).json({ message: 'Geçersiz şifre' });
      return;
    }

    // JWT token oluştur
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h', // Token geçerlilik süresi
    });

    res.json({ token, message: 'Başarılı giriş' });
  } catch (error) {
    console.error('Sunucu hatası:', error); // Debug için eklendi
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};
