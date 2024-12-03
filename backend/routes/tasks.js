const express = require('express');
const router = express.Router();

// List tasks
router.get('/', (req, res) => {
  // TODO: Fetch and return tasks
  res.json({ message: 'Tasks listing endpoint' });
});

module.exports = router;
