const express = require('express');
const prisma = require('../prisma'); // Adjust this path as needed
const router = express.Router();

// User registration or update
router.post('/', async (req, res) => {
  try {
    const { telegramId, username, isPremium } = req.body;

    // Validate input
    if (!telegramId || !username) {
      console.error('Validation failed:', req.body);
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Incoming user data:', { telegramId, username, isPremium });

    // Save or update the user
    const user = await prisma.user.upsert({
      where: { telegramId },
      update: { username, isPremium },
      create: {
        telegramId,
        username,
        isPremium,
      },
    });

    console.log('Database upsert result:', user);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error saving user to database:', error);
    res.status(500).json({ error: 'Failed to save user data' });
  }
});

module.exports = router;
