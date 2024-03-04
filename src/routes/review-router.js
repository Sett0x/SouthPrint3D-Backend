import express from 'express';
import { checkToken, isAdmin } from '../middlewares/auth-middleware.js';
import * as ReviewController from '../controllers/review-controller.js';

const router = express.Router();


router.use(checkToken);

router.get('',isAdmin ,ReviewController.getAllReviews);

router.get('/:productId', ReviewController.getProductReviews);
router.post('', ReviewController.createReview);
router.put('/:id', ReviewController.updateReview);
router.delete('/:id', ReviewController.deleteReview);

export default router;
