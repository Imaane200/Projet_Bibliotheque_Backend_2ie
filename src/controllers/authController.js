// --- src/controllers/authController.js ---

const pool = require('../config/db');        // Notre pool de connexions MySQL
const bcrypt = require('bcryptjs');           // Pour hacher les mots de passe
const jwt = require('jsonwebtoken');          // Pour créer les tokens JWT

// Fonction pour l'inscription (register)
exports.register = async (req, res) => {
  try {
    // On récupère les données envoyées par le formulaire d'inscription frontend
    const { nom, email, password } = req.body;

    // --- Validation basique ---
    if (!nom || !email || !password) {
      return res.status(400).json({ message: 'Veuillez remplir tous les champs.' });
    }

    // --- Hachage du mot de passe ---
    // On génère un "sel" pour renforcer la sécurité du hachage
    const salt = await bcrypt.genSalt(10);
    // On hache le mot de passe de l'utilisateur avec le sel
    const hashedPassword = await bcrypt.hash(password, salt);

    // --- Insertion dans la base de données ---
    // On insère le nouvel utilisateur dans la table "etudiants"
    const [result] = await pool.query(
      'INSERT INTO etudiants (nom, email, mot_de_passe) VALUES (?, ?, ?)',
      [nom, email, hashedPassword]
    );

    // On renvoie une réponse de succès
    res.status(201).json({ message: 'Utilisateur créé avec succès', userId: result.insertId });

  } catch (error) {
    // Gestion des erreurs (ex: email déjà existant)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
    }
    console.error(error);
    res.status(500).json({ message: 'Erreur du serveur lors de la création de l\'utilisateur.' });
  }
};

// Fonction pour la connexion (login)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // --- Recherche de l'utilisateur ---
        const [users] = await pool.query('SELECT * FROM etudiants WHERE email = ?', [email]);
        
        // Si aucun utilisateur n'est trouvé avec cet email
        if (users.length === 0) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        }

        const user = users[0];

        // --- Vérification du mot de passe ---
        // On compare le mot de passe fourni avec le mot de passe haché dans la base de données
        const isMatch = await bcrypt.compare(password, user.mot_de_passe);

        // Si les mots de passe ne correspondent pas
        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        }

        // --- Création du Token JWT ---
        // On définit les informations qu'on veut stocker dans le token
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        // On signe le token avec notre clé secrète
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '4h' }, (err, token) => {
            if (err) throw err;
            // On renvoie le token et les informations de l'utilisateur (sans le mot de passe) au frontend
            res.json({
                token,
                user: {
                    id: user.id,
                    nom: user.nom,
                    email: user.email,
                    role: user.role
                }
            });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur du serveur.' });
    }
};