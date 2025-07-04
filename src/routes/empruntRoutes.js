// --- src/routes/empruntRoutes.js ---

const express = require('express');
const router = express.Router();
const empruntController = require('../controllers/empruntController');
const { protect, isAdmin } = require('../middleware/authMiddleware'); // On importe aussi isAdmin

// --- ROUTES POUR L'ÉTUDIANT CONNECTÉ ---
// L'utilisateur doit juste être connecté pour y accéder

// Route pour qu'un étudiant récupère ses propres emprunts en cours
router.get('/my-borrows', protect, empruntController.getMyBorrows);

// Route pour emprunter un livre
router.post('/', protect, empruntController.borrowBook);


// --- ROUTES POUR L'ADMINISTRATEUR ---
// L'utilisateur doit être connecté ET être un admin

// Route pour que l'admin voie TOUS les emprunts en cours
router.get('/all', [protect, isAdmin], empruntController.getAllBorrows);

// Route pour que l'admin marque un livre comme retourné
router.put('/:id/return', [protect, isAdmin], empruntController.returnBook);


module.exports = router;
