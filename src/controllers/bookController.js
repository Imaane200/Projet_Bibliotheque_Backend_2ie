// --- src/controllers/bookController.js ---

const pool = require('../config/db');

/**
 * Récupère tous les livres de la base de données.
 */
exports.getAllBooks = async (req, res) => {
  try {
    const [books] = await pool.query('SELECT * FROM livres ORDER BY titre ASC');
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur du serveur lors de la récupération des livres." });
  }
};

/**
 * Récupère les détails d'un seul livre par son ID.
 * C'est la nouvelle fonction que nous ajoutons.
 */
exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const [books] = await pool.query('SELECT * FROM livres WHERE id = ?', [id]);

    if (books.length === 0) {
      return res.status(404).json({ message: "Livre non trouvé." });
    }
    res.json(books[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur du serveur." });
  }
};

/**
 * Crée un nouveau livre.
 */
exports.createBook = async (req, res) => {
  try {
    const { titre, auteur, genre, image_url } = req.body;
    if (!titre || !auteur) {
      return res.status(400).json({ message: "Le titre et l'auteur sont requis." });
    }

    const [result] = await pool.query(
      'INSERT INTO livres (titre, auteur, genre, image_url) VALUES (?, ?, ?, ?)',
      [titre, auteur, genre, image_url || null]
    );

    res.status(201).json({ id: result.insertId, ...req.body });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur du serveur lors de la création du livre." });
  }
};

/**
 * Met à jour un livre existant.
 */
exports.updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { titre, auteur, genre, image_url } = req.body;

        if (!titre || !auteur) {
            return res.status(400).json({ message: "Le titre et l'auteur sont requis." });
        }

        const [result] = await pool.query(
            'UPDATE livres SET titre = ?, auteur = ?, genre = ?, image_url = ? WHERE id = ?',
            [titre, auteur, genre, image_url, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Livre non trouvé." });
        }

        res.json({ message: "Livre mis à jour avec succès." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur du serveur lors de la mise à jour du livre." });
    }
};

/**
 * Supprime un livre.
 */
exports.deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query('DELETE FROM livres WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Livre non trouvé." });
        }

        res.json({ message: "Livre supprimé avec succès." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur du serveur lors de la suppression du livre." });
    }
};
