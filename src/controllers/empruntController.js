// --- src/controllers/empruntController.js ---

const pool = require('../config/db');

/**
 * Permet à un étudiant d'emprunter un livre.
 * Utilise une transaction pour garantir l'intégrité des données.
 */
exports.borrowBook = async (req, res) => {
  const etudiantId = req.user.id;
  const { livreId } = req.body;

  if (!livreId) {
    return res.status(400).json({ message: "L'ID du livre est requis." });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [livres] = await connection.query('SELECT disponible FROM livres WHERE id = ? FOR UPDATE', [livreId]);
    
    if (livres.length === 0) throw new Error("Livre non trouvé.");
    if (!livres[0].disponible) throw new Error("Ce livre n'est pas disponible à l'emprunt.");

    await connection.query('UPDATE livres SET disponible = FALSE WHERE id = ?', [livreId]);

    const dateRetourPrevue = new Date();
    dateRetourPrevue.setDate(dateRetourPrevue.getDate() + 14);

    await connection.query(
      'INSERT INTO emprunts (livre_id, etudiant_id, date_retour_prevue) VALUES (?, ?, ?)',
      [livreId, etudiantId, dateRetourPrevue]
    );

    await connection.commit();
    res.status(201).json({ message: "Livre emprunté avec succès." });

  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: error.message || "Erreur du serveur lors de l'emprunt." });
  } finally {
    connection.release();
  }
};

/**
 * Récupère la liste des emprunts de l'utilisateur actuellement connecté.
 */
exports.getMyBorrows = async (req, res) => {
    const etudiantId = req.user.id;
    try {
        const [emprunts] = await pool.query(
            `SELECT e.id, e.date_emprunt, e.date_retour_prevue, l.titre, l.auteur
             FROM emprunts e
             JOIN livres l ON e.livre_id = l.id
             WHERE e.etudiant_id = ? AND e.date_retour_effective IS NULL
             ORDER BY e.date_retour_prevue ASC`,
            [etudiantId]
        );
        res.json(emprunts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur du serveur lors de la récupération des emprunts." });
    }
};


/**
 * Récupère tous les emprunts en cours pour le tableau de bord admin.
 */
exports.getAllBorrows = async (req, res) => {
    try {
        const [emprunts] = await pool.query(
            `SELECT 
                e.id, 
                e.date_emprunt, 
                e.date_retour_prevue,
                l.titre as livre_titre,
                et.nom as etudiant_nom
             FROM emprunts e
             JOIN livres l ON e.livre_id = l.id
             JOIN etudiants et ON e.etudiant_id = et.id
             WHERE e.date_retour_effective IS NULL
             ORDER BY e.date_retour_prevue ASC`
        );
        res.json(emprunts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur du serveur lors de la récupération de tous les emprunts." });
    }
};


/**
 * Marque un livre comme retourné.
 * Utilise également une transaction.
 */
exports.returnBook = async (req, res) => {
    const { id } = req.params; // L'ID de l'emprunt
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Récupérer l'ID du livre depuis l'emprunt
        const [emprunts] = await connection.query('SELECT livre_id FROM emprunts WHERE id = ? AND date_retour_effective IS NULL', [id]);
        if (emprunts.length === 0) {
            throw new Error("Cet emprunt n'existe pas ou a déjà été retourné.");
        }
        const livreId = emprunts[0].livre_id;

        // 2. Mettre à jour l'emprunt en ajoutant la date de retour
        await connection.query('UPDATE emprunts SET date_retour_effective = NOW() WHERE id = ?', [id]);

        // 3. Rendre le livre de nouveau disponible
        await connection.query('UPDATE livres SET disponible = TRUE WHERE id = ?', [livreId]);

        await connection.commit();
        res.json({ message: "Livre marqué comme retourné avec succès." });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: error.message || "Erreur du serveur lors du retour du livre." });
    } finally {
        connection.release();
    }
};
