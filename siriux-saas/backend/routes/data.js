const express = require('express');
const router = express.Router();

// Mock data storage
let dataItems = [
  { id: '1', title: 'Sample Item 1', description: 'Description 1', userId: '1' },
  { id: '2', title: 'Sample Item 2', description: 'Description 2', userId: '1' }
];

// Get all data
router.get('/', (req, res) => {
  res.json(dataItems);
});

// Get single item
router.get('/:id', (req, res) => {
  const item = dataItems.find(d => d.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.json(item);
});

// Create new item
router.post('/', (req, res) => {
  const { title, description } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  const newItem = {
    id: Date.now().toString(),
    title,
    description: description || '',
    userId: '1', // In production, get from authenticated user
    createdAt: new Date().toISOString()
  };
  
  dataItems.push(newItem);
  res.status(201).json(newItem);
});

// Update item
router.put('/:id', (req, res) => {
  const { title, description } = req.body;
  const itemIndex = dataItems.findIndex(d => d.id === req.params.id);
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  dataItems[itemIndex] = { ...dataItems[itemIndex], title, description };
  res.json(dataItems[itemIndex]);
});

// Delete item
router.delete('/:id', (req, res) => {
  const itemIndex = dataItems.findIndex(d => d.id === req.params.id);
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  dataItems.splice(itemIndex, 1);
  res.json({ message: 'Item deleted successfully' });
});

module.exports = router;
