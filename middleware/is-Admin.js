"use strict";
const User = require('../models/user');

// Vérifie si l'utilisateur est administrateur
const isAdmin = (req, res, next) => {
  const userId = req.userId;

  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      if (!user.isAdmin) {
        return res.status(403).json({ error: 'You are not authorized to perform this action.' });
      }

      next(); // Passe à l'étape suivante si l'utilisateur est un administrateur.
    })
    .catch(error => {
      res.status(500).json({ error: 'An error occurred while checking permissions.', error });
    });
};

module.exports = isAdmin;
