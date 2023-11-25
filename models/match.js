const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // Unique identifier for the match
  date: {
    type: Date,
    required: true
  },
  player1: {
    type: String,
    required: true
  },
  player2: {
    type: String,
    required: true
  },
  winner: {
    type: String,
    required: true
  }
});

const Match = mongoose.model('Match', MatchSchema);

module.exports = Match;
