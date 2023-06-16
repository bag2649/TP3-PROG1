"use strict";

const Category = require('../models/category');
const User = require('../models/user');
// Récupérer la liste de toutes les catégories
exports.getCategories = (req, res, next) => {
  Category.find()
    .then(categories => {
      res.status(200).json(categories);
    })
    .catch(error => {
      res.status(500).json({ error: 'An error occurred while retrieving the categories.', error });
    });
};

// Récupérer une catégorie par son ID
exports.getCategoryById = (req, res, next) => {
  const categoryId = req.params.id;
  
  Category.findById(categoryId)
    .then(category => {
      if (!category) {
        return res.status(404).json({ error: 'The requested category was not found.' });
      }
      res.status(200).json(category);
    })
    .catch(error => {
        if (error.name === 'CastError') {
          return res.status(404).json({ error: 'The requested category was not found.' });
        }
        res.status(500).json({ error: 'An error occurred while retrieving the category.', error });
    });
};



// Créer une nouvelle catégorie
exports.createCategory = (req, res, next) => {
  const { name, description } = req.body;

  // Vérifier si l'utilisateur est administrateur
  const userId = req.userId;

  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      if (!user.isAdmin) {
        return res.status(403).json({ error: 'You are not authorized to perform this action.' });
      }

      // L'utilisateur est administrateur, créer la catégorie
      const category = new Category({
        name: name,
        description: description
      });

      return category.save();
    })
    .then(result => {
      res.status(201).json({ message: 'The category has been created successfully.', category: result });
    })
    .catch(error => {
      res.status(500).json({ error: 'An error occurred while creating the category.', error });
    });
};


// Mettre à jour une catégorie existante
exports.updateCategory = (req, res, next) => {
  const categoryId = req.params.id;
  const { name, description } = req.body;
  const userId = req.userId; // Assurez-vous d'avoir le bon identifiant de l'utilisateur ici
console.log(userId)
  // Vérification si l'utilisateur est administrateur
  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      if (!user.isAdmin) {
        return res.status(403).json({ error: 'You are not authorized to perform this action.' });
      }

      // L'utilisateur est un administrateur, poursuivre avec la mise à jour de la catégorie

      Category.findById(categoryId)
        .then(category => {
          if (!category) {
            return res.status(404).json({ error: 'The requested category does not exist.' });
          }

          category.name = name;
          category.description = description;

          return category.save();
        })
        .then(result => {
          res.status(200).json({ message: 'The category has been updated successfully.', category: result });
        })
        .catch(error => {
          if (error.name === 'CastError') {
            return res.status(404).json({ error: 'The requested category does not exist.' });
          }
          res.status(500).json({ error: 'An error occurred while updating the category.', error });
        });
    })
    .catch(error => {
      res.status(500).json({ error: 'An error occurred while checking permissions.', error });
    });
};


// Supprimer une catégorie existante
exports.deleteCategory = (req, res, next) => {
  const categoryId = req.params.id;

  // Vérifier si l'utilisateur est administrateur
  const userId = req.userId;

  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      if (!user.isAdmin) {
        return res.status(403).json({ error: 'You are not authorized to perform this action.' });
      }

      // L'utilisateur est administrateur, supprimer la catégorie
      Category.findByIdAndRemove(categoryId)
        .then(category => {
          if (!category) {
            return res.status(404).json({ error: 'The requested category does not exist.' });
          }

          res.status(200).json({ message: 'The category has been deleted successfully.' });
        })
        .catch(error => {
          if (error.name === 'CastError') {
            return res.status(404).json({ error: 'The requested category does not exist.' });
          }
          res.status(500).json({ error: 'An error occurred while deleting the category.', error });
        });
    })
    .catch(error => {
      res.status(500).json({ error: 'An error occurred while checking permissions.', error });
    });
};

