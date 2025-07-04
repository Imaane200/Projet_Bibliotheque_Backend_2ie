// --- src/controllers/reviewController.js ---

const pool = require('../config/db');

/**
 * Récupère tous les commentaires pour un livre spécifique.
 * Inclut le nom de l'étudiant qui a posté le commentaire.
 */
exports.getBookReviews = async (req, res) => {
  try {
    const { livreId } = req.params;
    const [reviews] = await pool.query(
      `SELECT 
        c.id, c.note, c.commentaire, c.date_creation, e.nom as etudiant_nom
       FROM commentaires c
       JOIN etudiants e ON c.etudiant_id = e.id
       WHERE c.livre_id = ?
       ORDER BY c.date_creation DESC`,
      [livreId]
    );
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur du serveur lors de la récupération des avis." });
  }
};

/**
 * Permet à un étudiant connecté de poster un commentaire sur un livre.
 */
exports.addBookReview = async (req, res) => {
  try {
    const { livreId } = req.params;
    const etudiantId = req.user.id; // L'ID vient du token JWT
    const { note, commentaire } = req.body;

    // Validation des données
    if (!note || note < 1 || note > 5) {
      return res.status(400).json({ message: "Une note entre 1 et 5 est requise." });
    }

    // Insertion du nouveau commentaire
    const [result] = await pool.query(
      'INSERT INTO commentaires (livre_id, etudiant_id, note, commentaire) VALUES (?, ?, ?, ?)',
      [livreId, etudiantId, note, commentaire]
    );

    // On renvoie le commentaire nouvellement créé
    const [newReview] = await pool.query(
        `SELECT c.id, c.note, c.commentaire, c.date_creation, e.nom as etudiant_nom
         FROM commentaires c JOIN etudiants e ON c.etudiant_id = e.id 
         WHERE c.id = ?`,
        [result.insertId]
    );

    res.status(201).json(newReview[0]);

  } catch (error) {
    // Gestion de l'erreur si l'utilisateur a déjà noté ce livre
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Vous avez déjà laissé un avis pour ce livre.' });
    }
    console.error(error);
    res.status(500).json({ message: "Erreur du serveur lors de l'ajout de l'avis." });
  }
};
