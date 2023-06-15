"use strict";

const Category = require('../models/category');

// Récupérer la liste de toutes les catégories
exports.getCategories = (req, res, next) => {
  Category.find()
    .then(categories => {
      res.status(200).json(categories);
    })
    .catch(error => {
      res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des catégories.', error });
    });
};

// Récupérer une catégorie par son ID
exports.getCategoryById = (req, res, next) => {
  const categoryId = req.params.id;
  
  Category.findById(categoryId)
    .then(category => {
      if (!category) {
        return res.status(404).json({ error: 'La catégorie demandée n\'existe pas.' });
      }
      res.status(200).json(category);
    })
    .catch(error => {
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de la catégorie.', error });
      });
      
};

// Créer une nouvelle catégorie
exports.createCategory = (req, res, next) => {
  const { name, description } = req.body;

  const category = new Category({
    name: name,
    description: description
  });

  category.save()
    .then(result => {
      res.status(201).json({ message: 'La catégorie a été créée avec succès.', category: result });
    })
    .catch(error => {
      res.status(500).json({ error: 'Une erreur est survenue lors de la création de la catégorie.', error });
    });
};

// Mettre à jour une catégorie existante
exports.updateCategory = (req, res, next) => {
  const categoryId = req.params.id;
  const { name, description } = req.body;

  Category.findById(categoryId)
    .then(category => {
      if (!category) {
        return res.status(404).json({ error: 'La catégorie demandée n\'existe pas.' });
      }

      category.name = name;
      category.description = description;

      return category.save();
    })
    .then(result => {
      res.status(200).json({ message: 'La catégorie a été mise à jour avec succès.', category: result });
    })
    .catch(error => {
      res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour de la catégorie.', error });
    });
};

// Supprimer une catégorie existante
exports.deleteCategory = (req, res, next) => {
  const categoryId = req.params.id;

  Category.findByIdAndRemove(categoryId)
    .then(category => {
      if (!category) {
        return res.status(404).json({ error: 'La catégorie demandée n\'existe pas.' });
      }

      res.status(200).json({ message: 'La catégorie a été supprimée avec succès.' });
    })
    .catch(error => {
      res.status(500).json({ error: 'Une erreur est survenue lors de la suppression de la catégorie.', error });
    });
};
