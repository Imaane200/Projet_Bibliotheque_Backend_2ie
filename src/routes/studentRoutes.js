// --- src/routes/studentRoutes.js ---

const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Toutes les routes dans ce fichier sont protégées et nécessitent un rôle d'administrateur.
// On applique les middlewares à toutes les routes du routeur.
router.use(protect, isAdmin);

// Route pour récupérer tous les étudiants
// GET /api/etudiants/
router.get('/', studentController.getAllStudents);

// Route pour mettre à jour un étudiant
// PUT /api/etudiants/:id
router.put('/:id', studentController.updateStudent);

// Route pour supprimer un étudiant
// DELETE /api/etudiants/:id
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
