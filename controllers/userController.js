"use strict";

const User = require('../models/user');

exports.getUsers = (req, res, next) => {
  User.find({}, '-email -password')
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des utilisateurs.', error });
    });
};

exports.getUserById = (req, res, next) => {
    const userId = req.params.id;
  
    User.findById(userId, '-email -password')
      .then(user => {
        if (!user) {
          return res.status(404).json({ error: 'L\'utilisateur demandé n\'existe pas.' });
        }
        res.status(200).json(user);
      })
      .catch(error => {
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de l\'utilisateur.', error });
      });
  };

  exports.getUserProfile = (req, res, next) => {
    const userId = req.user.userId; // Utilisez req.user.userId au lieu de req.userId
    console.log(userId);
    User.findOne({ _id: userId }, '-email -password')
      .then(user => {
        if (!user) {
          return res.status(404).json({ error: "L'utilisateur connecté n'existe pas." });
        }
        res.status(200).json(user);
      })
      .catch(error => {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération de l'utilisateur.", error });
      });
  };
  
  


exports.updateUser = (req, res, next) => {
  const userId = req.params.id;
  const { firstName, lastName, city } = req.body;

  if (req.userId !== userId) {
    return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à modifier cet utilisateur.' });
  }

  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'L\'utilisateur demandé n\'existe pas.' });
      }

      user.firstName = firstName;
      user.lastName = lastName;
      user.city = city;

      return user.save();
    })
    .then(result => {
      res.status(200).json({ message: 'L\'utilisateur a été mis à jour avec succès.', user: result });
    })
    .catch(error => {
      res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour de l\'utilisateur.', error });
    });
};



exports.deleteUser = (req, res, next) => {
  const userId = req.params.id;

  if (req.userId !== userId) {
    return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à supprimer cet utilisateur.' });
  }

  User.findByIdAndRemove(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'L\'utilisateur demandé n\'existe pas.' });
      }

      res.status(200).json({ message: 'L\'utilisateur a été supprimé avec succès.' });
    })
    .catch(error => {
      res.status(500).json({ error: 'Une erreur est survenue lors de la suppression de l\'utilisateur.', error });
    });
};
