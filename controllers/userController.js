"use strict";

const User = require('../models/user');

exports.getUsers = (req, res, next) => {
  User.find({}, '-email -password')
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res.status(500).json({ error: 'An error occurred while retrieving the users.', error });
    });
};

exports.getUserById = (req, res, next) => {
  const userId = req.params.id;

  User.findById(userId, '-email -password')
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: "The requested user does not exist." });
      }
      res.status(200).json(user);
    })
    .catch(error => {
      if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(404).json({ error: "The requested user does not exist." });
      }
      res.status(500).json({ error: 'An error occurred while retrieving the user.', error });
    });
};




exports.getUserProfile = (req, res, next) => {
  const userId = req.userId;
  console.log(userId);
  User.findOne({ _id: userId }, '-email -password')
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: "The connected user does not exist." });
      }
      res.status(200).json(user);
    })
    .catch(error => {
      res.status(500).json({ error: "An error occurred while retrieving the user.", error });
    });
};



exports.updateUser = (req, res, next) => {
  const userId = req.params.id;
  const { firstname, lastname, city, email, password} = req.body;

  if (req.userId !== userId) {
    return res.status(403).json({ error: 'You are not authorized to modify this user.' });
  }

  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'The requested user does not exist.' });
      }
      user.password = password;
      user.email = email;
      user.firstname = firstname;
      user.lastname = lastname;
      user.city = city;

      return user.save();
    })
    .then(result => {
      res.status(200).json({ message: 'The user has been updated successfully.', user: result });
    })
    .catch(error => {
      res.status(500).json({ error: 'An error occurred while updating the user.', error });
    });
};



exports.deleteUser = (req, res, next) => {
  const userId = req.params.id;

  if (req.userId !== userId) {
    return res.status(403).json({ error: "You are not authorized to delete this user." });
  }

  User.findByIdAndRemove(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: "The requested user does not exist." });
      }

      res.status(200).json({ message: "The user has been successfully deleted." });
    })
    .catch(error => {
      res.status(500).json({ error: "An error occurred while deleting the user.", error });
    });
};

