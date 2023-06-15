"use strict";

const isAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
      next(); // Passe à la prochaine étape du traitement de la requête
    } else {
      res.status(403).json({ error: 'Access denied. User is not an administrator.' });
    }
  };
  
 
  module.exports = isAdmin;