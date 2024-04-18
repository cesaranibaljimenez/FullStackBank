// userController.js

const User = require('../models/User'); // If necessary, import the User model

// Function to handle the creation of a new user
function createUser(req, res) {
    const { name, email, password } = req.body;
  
    // Logic to validate the form data and create a new user in the database
    
    const newUser = new User({ name, email, password });
    newUser.save()
      .then(user => {
        res.status(201).json({ message: 'User created successfully', user });
      })
      .catch(error => {
        res.status(500).json({ message: 'Error creating user', error });
      });

}

module.exports = { createUser }; // Export the function createUser
