"use strict";

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

/** Vérifie si la requête a un token JWT valide */

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  console.log('authHeader', authHeader)
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthenticated.' });
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SECRET_JWT);
  } catch (err) {
    err.statusCode = 401;
    return next(err);
  }
  if (!decodedToken) {
    const error = new Error('Unauthenticated.');
    error.statusCode = 401;
    return next(error);
  }
  req.userId = decodedToken.userId.toString(); // Convertir en chaîne de caractères
  // Passe le token décodé dans la requête pour pouvoir l'utiliser ailleurs
  req.user = decodedToken;
  console.log('decodedToken', decodedToken);
  next();
};
