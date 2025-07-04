// --- src/middleware/authMiddleware.js ---

const jwt = require('jsonwebtoken');

// Middleware pour protéger les routes en vérifiant le token
exports.protect = (req, res, next) => {
  let token;
  // L'en-tête d'autorisation ressemble à "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // On extrait le token de l'en-tête (on enlève "Bearer ")
      token = req.headers.authorization.split(' ')[1];

      // On vérifie et décode le token avec notre clé secrète
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // On attache les informations de l'utilisateur décodé à l'objet `req`
      // pour que les prochains contrôleurs puissent y accéder
      req.user = decoded.user;

      // On passe au prochain middleware ou au contrôleur final
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Token non valide, autorisation refusée' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Aucun token, autorisation refusée' });
  }
};

// Middleware pour vérifier si l'utilisateur est un admin
// Ce middleware doit TOUJOURS être utilisé APRÈS le middleware "protect"
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // L'utilisateur est un admin, on continue
  } else {
    // Si l'utilisateur n'est pas un admin, on renvoie une erreur "Interdit"
    res.status(403).json({ message: "Accès refusé. Rôle d'administrateur requis." });
  }
};