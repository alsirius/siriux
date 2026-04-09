const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Mock users (shared with auth.js)
const users = [];

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get profile
router.get('/profile', verifyToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: user.createdAt
  });
});

// Update profile
router.put('/profile', verifyToken, (req, res) => {
  const { firstName, lastName } = req.body;
  const userIndex = users.findIndex(u => u.id === req.user.userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  users[userIndex] = { ...users[userIndex], firstName, lastName };
  
  res.json({
    message: 'Profile updated successfully',
    user: {
      id: users[userIndex].id,
      email: users[userIndex].email,
      firstName: users[userIndex].firstName,
      lastName: users[userIndex].lastName
    }
  });
});

module.exports = router;
