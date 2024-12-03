const express = require('express');
const router = express.Router();

// Leaderboard
router.get('/', (req, res) => {
  // TODO: Fetch and return leaderboard data
  res.json({ message: 'Leaderboard endpoint' });
});

module.exports = router;
