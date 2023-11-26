const express = require('express');
const Match = require('../models/match');

const MatchRouter = express();

MatchRouter.get('/', async (req, res) => {
    try {
      const matches = await Match.find();
      res.json(matches);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

MatchRouter.post('/api/matches', async (req, res) => {
const { date, player1, player2, winner } = req.body;

try {
    const match = new Match({
    _id: new mongoose.Types.ObjectId(), // Generate a new ObjectId for the _id field
    date: new Date(date),
    player1,
    player2,
    winner,
    });

    await match.save();

    res.json({ message: 'Match created successfully', matchId: match._id });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
}
});

module.exports = MatchRouter;