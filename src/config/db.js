// --- src/config/db.js ---

// On importe le pilote mysql2 avec le support des promesses pour utiliser async/await
const mysql = require('mysql2/promise');
// On importe dotenv pour charger les variables d'environnement du fichier .env
require('dotenv').config();

// On crée un "pool" de connexions à la base de données.
// Un pool est plus performant qu'une simple connexion car il gère plusieurs connexions simultanément.
const pool = mysql.createPool({
  host: process.env.DB_HOST,       // L'adresse du serveur de base de données
  user: process.env.DB_USER,       // L'utilisateur de la base de données
  password: process.env.DB_PASSWORD, // Le mot de passe (souvent vide sur XAMPP par défaut)
  database: process.env.DB_NAME,   // Le nom de notre base de données
  waitForConnections: true,        // Attendre si toutes les connexions sont occupées
  connectionLimit: 10,             // Nombre maximum de connexions dans le pool
  queueLimit: 0                    // Pas de limite sur le nombre de requêtes en attente
});

// On exporte le pool pour qu'il puisse être utilisé dans d'autres fichiers (nos controllers).
module.exports = pool;