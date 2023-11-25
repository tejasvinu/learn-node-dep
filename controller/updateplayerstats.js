
const updatePlayerStats = async (match) => {
    try {
      const { player1, player2, winner } = match;
  
      // Find or create player stats for player1
      let player1Stats = await PlayerStats.findOne({ name: player1 });
  
      if (!player1Stats) {
        player1Stats = new PlayerStats({
          name: player1,
          wins: 0,
          losses: 0,
          draws: 0,
          matches: 0,
          winLossRatio: 0,
          elo: 1000 // Initial Elo rating
        });
      }
  
      // Find or create player stats for player2
      let player2Stats = await PlayerStats.findOne({ name: player2 });
  
      if (!player2Stats) {
        player2Stats = new PlayerStats({
          name: player2,
          wins: 0,
          losses: 0,
          draws: 0,
          matches: 0,
          winLossRatio: 0,
          elo: 1000 // Initial Elo rating
        });
      }
  
      // Calculate expected scores
      const expectedScore1 = 1 / (1 + Math.pow(10, (player2Stats.elo - player1Stats.elo) / 400));
      const expectedScore2 = 1 / (1 + Math.pow(10, (player1Stats.elo - player2Stats.elo) / 400));
  
      // Update Elo ratings based on match result
      const kFactor = 32; // You can adjust the k-factor according to your needs
  
      if (winner === player1) {
        player1Stats.wins += 1;
        player1Stats.winLossRatio = player1Stats.wins / player1Stats.matches;
        player1Stats.elo += kFactor * (1 - expectedScore1);
        
        player2Stats.losses += 1;
        player2Stats.winLossRatio = player2Stats.wins / player2Stats.matches;
        player2Stats.elo += kFactor * (0 - expectedScore2);
      } else if (winner === player2) {
        player2Stats.wins += 1;
        player2Stats.winLossRatio = player2Stats.wins / player2Stats.matches;
        player2Stats.elo += kFactor * (1 - expectedScore2);
        
        player1Stats.losses += 1;
        player1Stats.winLossRatio = player1Stats.wins / player1Stats.matches;
        player1Stats.elo += kFactor * (0 - expectedScore1);
      } else {
        player1Stats.draws += 1;
        player2Stats.draws += 1;
        
        player1Stats.winLossRatio = player1Stats.wins / player1Stats.matches;
        player2Stats.winLossRatio = player2Stats.wins / player2Stats.matches;
      }
  
      // Increment the total number of matches for both players
      player1Stats.matches += 1;
      player2Stats.matches += 1;
  
      // Save the updated player stats to the database
      await player1Stats.save();
      await player2Stats.save();
  
      console.log('Player stats updated successfully!');
    } catch (error) {
      console.error('Error updating player stats:', error);
    }
  };
  
module.exports = updatePlayerStats;