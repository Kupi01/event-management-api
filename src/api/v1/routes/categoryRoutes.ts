import { Router, Request, Response } from 'express';
import { CategoryController } from '../controllers/categoryController';

const router = Router();
const categoryController = new CategoryController();

// GET all categories
router.get('/', async (req: Request, res: Response) => {
  await categoryController.getAllCategories(req, res);
});

// GET category by ID
router.get('/:id', async (req: Request, res: Response) => {
  await categoryController.getCategoryById(req, res);
});

// POST create category
router.post('/', async (req: Request, res: Response) => {
  await categoryController.createCategory(req, res);
});

// PUT update category
router.put('/:id', async (req: Request, res: Response) => {
  await categoryController.updateCategory(req, res);
});

// DELETE category
router.delete('/:id', async (req: Request, res: Response) => {
  await categoryController.deleteCategory(req, res);
});

export default router;
