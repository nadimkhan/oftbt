const express = require('express');
const router = express.Router();

// Referral info
router.get('/:userId', (req, res) => {
  const { userId } = req.params;

  // TODO: Fetch and return referral info for the given userId
  res.json({ message: `Referral info for user ${userId}` });
});

module.exports = router;
