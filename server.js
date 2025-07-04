// --- server.js ---

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// On importe nos fichiers de routes
const authRoutes = require('./src/routes/authRoutes');
const bookRoutes = require('./src/routes/bookRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const empruntRoutes = require('./src/routes/empruntRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes'); // <-- AJOUTER CETTE LIGNE

const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Routes de l'API ---
app.use('/api/auth', authRoutes);
app.use('/api/livres', bookRoutes);
app.use('/api/etudiants', studentRoutes);
app.use('/api/emprunts', empruntRoutes);

// On ajoute la route pour les commentaires
// On dit à Express d'utiliser le routeur de commentaires pour toutes les requêtes
// qui correspondent à ce modèle.
app.use('/api/livres/:livreId/reviews', reviewRoutes); 

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Le serveur tourne sur le port ${PORT}`);
});
