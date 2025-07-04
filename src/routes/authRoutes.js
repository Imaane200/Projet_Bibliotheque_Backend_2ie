// --- src/routes/authRoutes.js ---

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route pour l'inscription d'un nouvel utilisateur
// Quand une requête POST arrive sur /api/auth/register, on appelle la fonction "register" du contrôleur d'authentification.
router.post('/register', authController.register);

// Route pour la connexion d'un utilisateur
// Quand une requête POST arrive sur /api/auth/login, on appelle la fonction "login".
router.post('/login', authController.login);

module.exports = router;