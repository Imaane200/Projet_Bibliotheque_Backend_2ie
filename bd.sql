-- Active: 1747216261342@@127.0.0.1@3306@bibliotheque_2ie


CREATE DATABASE bibliotheque_2ie;

USE bibliotheque_2ie;

CREATE TABLE etudiants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    role ENUM('etudiant', 'admin') NOT NULL DEFAULT 'etudiant',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE livres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    auteur VARCHAR(255) NOT NULL,
    genre VARCHAR(100),
    image_url VARCHAR(255),
    disponible BOOLEAN NOT NULL DEFAULT TRUE,
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE emprunts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    livre_id INT NOT NULL,
    etudiant_id INT NOT NULL,
    date_emprunt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_retour_prevue DATE NOT NULL,
    date_retour_effective DATE NULL,
    FOREIGN KEY (livre_id) REFERENCES livres(id) ON DELETE CASCADE,
    FOREIGN KEY (etudiant_id) REFERENCES etudiants(id) ON DELETE CASCADE
);


CREATE TABLE commentaires (
    id INT AUTO_INCREMENT PRIMARY KEY,
    livre_id INT NOT NULL,
    etudiant_id INT NOT NULL,
    note INT NOT NULL CHECK (note >= 1 AND note <= 5),
    commentaire TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (livre_id) REFERENCES livres(id) ON DELETE CASCADE,
    FOREIGN KEY (etudiant_id) REFERENCES etudiants(id) ON DELETE CASCADE,
    -- On s'assure qu'un étudiant ne peut laisser qu'un seul avis par livre
    UNIQUE KEY unique_avis (livre_id, etudiant_id)
);


CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Ajout d'un admin par défaut (mot de passe haché de "admin123")
INSERT INTO admin_users (username, email, password)
VALUES ('admin', 'admin@2ie.edu', '$2b$10$Y6fBdQJ0rHEs9MFdv6DovOUOKXQd1FKu9ON9usncX9GvhuvKUVsdy');



UPDATE etudiants
SET role = 'admin'
WHERE id = 5;

SELECT id, nom, email, role FROM etudiants WHERE id = 5;

DELETE FROM etudiants
WHERE id = 5;

