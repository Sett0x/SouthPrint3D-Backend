// routes/review-router.js
import express from 'express';
import { checkToken, isAdmin } from '../middlewares/auth-middleware.js';
import {
  getAllReviews,
  getProductReviews,
  createReview,
  updateReview,
  deleteReview
} from '../services/database/review-db-service.js';

const router = express.Router();

router.use(checkToken);

router.get('', isAdmin, getAllReviews);
router.get('/:productId', getProductReviews);
router.post('/:productId', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

export default router;
