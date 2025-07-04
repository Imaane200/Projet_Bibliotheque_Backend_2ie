// --- src/routes/reviewRoutes.js ---

const express = require('express');
// `mergeParams: true` est crucial pour que ce routeur puisse accéder aux params du routeur parent (comme :livreId)
const router = express.Router({ mergeParams: true }); 
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Route pour récupérer tous les avis d'un livre (publique)
// GET /api/livres/:livreId/reviews
router.get('/', reviewController.getBookReviews);

// Route pour ajouter un avis sur un livre (protégée, il faut être connecté)
// POST /api/livres/:livreId/reviews
router.post('/', protect, reviewController.addBookReview);

module.exports = router;
