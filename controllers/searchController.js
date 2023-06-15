"use strict";

const Product = require('../models/product');

exports.searchProducts = (req, res, next) => {
  const searchQuery = req.query.q; // Récupérer le paramètre q de la requête

  const regex = new RegExp(searchQuery, 'i'); // Créer une expression régulière pour effectuer la recherche

  Product.find({ title: regex }) // Utiliser l'expression régulière pour trouver les produits correspondants au titre
    .then(products => {
      res.status(200).json(products);
    })
    .catch(err => {
      res.status(500).json({ error: 'Une erreur s\'est produite lors de la recherche des produits.' });
    });
};
