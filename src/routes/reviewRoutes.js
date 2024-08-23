const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.get('/reviews', reviewController.getAllReviews);
router.get('/reviews/:id', reviewController.getReviewById);
router.post('/reviews', reviewController.createReview);
router.put('/reviews/:id', reviewController.updateReview);
router.delete('/reviews/:id', reviewController.deleteReview);
router.get('/products/:productId/reviews', reviewController.getReviewsByProductId);
router.get('/users/:userId/reviews', reviewController.getReviewsByUserId);

module.exports = router;