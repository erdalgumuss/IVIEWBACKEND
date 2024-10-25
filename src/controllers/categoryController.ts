import { Request, Response } from 'express';
import Category from '../models/Category'; // Kategori modelini içe aktarın

// Kategori ekleme (POST)
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  const { name, description } = req.body;

  try {
    const newCategory = new Category({
      name,
      description,
    });

    const savedCategory = await newCategory.save();
    res.status(201).json({ message: 'Kategori başarıyla oluşturuldu', category: savedCategory });
  } catch (error) {
    res.status(500).json({ message: 'Kategori oluşturulamadı', error });
  }
};

// Kategorileri listeleme (GET)
export const listCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Kategoriler getirilemedi', error });
  }
};

// Kategori güncelleme (PUT)
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedCategory) {
      res.status(404).json({ message: 'Kategori bulunamadı' });
      return;
    }

    res.status(200).json({ message: 'Kategori başarıyla güncellendi', category: updatedCategory });
  } catch (error) {
    res.status(500).json({ message: 'Kategori güncellenemedi', error });
  }
};

// Kategori silme (DELETE)
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      res.status(404).json({ message: 'Kategori bulunamadı' });
      return;
    }

    res.status(200).json({ message: 'Kategori başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Kategori silinemedi', error });
  }
};
