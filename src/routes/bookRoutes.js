    // --- src/routes/bookRoutes.js ---

    const express = require('express');
    const router = express.Router();
    const bookController = require('../controllers/bookController');
    const { protect, isAdmin } = require('../middleware/authMiddleware');

    // Cette route reste publique, tout le monde peut voir la liste des livres
    router.get('/', bookController.getAllBooks);

    // Récupérer un livre par son ID. 
    router.get('/:id', bookController.getBookById);

    // --- ROUTES PROTÉGÉES ---
    router.post('/', [protect, isAdmin], bookController.createBook);
    router.put('/:id', [protect, isAdmin], bookController.updateBook);
    router.delete('/:id', [protect, isAdmin], bookController.deleteBook);

    module.exports = router;
    