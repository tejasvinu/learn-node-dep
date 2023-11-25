const express = require('express');
const PlayerRouter = express();
const Player = require('../models/player');

PlayerRouter.get('/', async (req, res) => {
    try {
        const players = await Player.find();
        res.json(players);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
});

module.exports = PlayerRouter;