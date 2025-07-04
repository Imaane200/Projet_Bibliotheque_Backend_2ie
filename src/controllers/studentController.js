// --- src/controllers/studentController.js ---

const pool = require('../config/db');

/**
 * Récupère tous les étudiants de la base de données.
 * Ne renvoie jamais les mots de passe.
 */
exports.getAllStudents = async (req, res) => {
  try {
    // La requête sélectionne tous les champs SAUF le mot de passe pour des raisons de sécurité.
    const [students] = await pool.query('SELECT id, nom, email, role, date_creation FROM etudiants ORDER BY nom ASC');
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur du serveur lors de la récupération des étudiants." });
  }
};

/**
 * Met à jour les informations d'un étudiant (par exemple, son rôle).
 */
exports.updateStudent = async (req, res) => {
    try {
        const { id } = req.params; // L'ID de l'étudiant à modifier
        const { nom, email, role } = req.body; // Les nouvelles informations

        // Validation simple
        if (!nom || !email || !role) {
            return res.status(400).json({ message: "Les champs nom, email et rôle sont requis." });
        }
        if (role !== 'etudiant' && role !== 'admin') {
            return res.status(400).json({ message: "Le rôle doit être 'etudiant' ou 'admin'." });
        }

        // Requête de mise à jour
        const [result] = await pool.query(
            'UPDATE etudiants SET nom = ?, email = ?, role = ? WHERE id = ?',
            [nom, email, role, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Étudiant non trouvé." });
        }

        res.json({ message: "Étudiant mis à jour avec succès." });

    } catch (error) {
        // Gestion de l'erreur si le nouvel email est déjà pris
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Cet email est déjà utilisé par un autre compte.' });
        }
        console.error(error);
        res.status(500).json({ message: "Erreur du serveur lors de la mise à jour de l'étudiant." });
    }
};

/**
 * Supprime un étudiant de la base de données.
 */
exports.deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        // On ne devrait pas pouvoir supprimer son propre compte admin depuis l'interface
        if (req.user.id === parseInt(id, 10)) {
            return res.status(400).json({ message: "Vous ne pouvez pas supprimer votre propre compte administrateur." });
        }

        const [result] = await pool.query('DELETE FROM etudiants WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Étudiant non trouvé." });
        }

        res.json({ message: "Étudiant supprimé avec succès." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur du serveur lors de la suppression de l'étudiant." });
    }
};
