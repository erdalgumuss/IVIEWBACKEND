import { Router } from 'express';
import { 
    createCategory, listCategories, updateCategory, deleteCategory 
} from '../controllers/categoryController';

const router = Router();

// Kategori ekleme (POST)
router.post('/categories', createCategory);

// Kategorileri listeleme (GET)
router.get('/categories', listCategories);

// Kategori güncelleme (PUT)
router.put('/categories/:id', updateCategory);

// Kategori silme (DELETE)
router.delete('/categories/:id', deleteCategory);

export default router;
