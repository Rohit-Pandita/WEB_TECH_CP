const express = require('express');
const VoteModel = require('../models/Vote');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

// Get today's meal voting results
router.get('/results', async (req, res) => {
  try {
    const votes = await VoteModel.getMealVotesForToday();
    res.json(votes);
  } catch (error) {
    console.error('Get votes error:', error);
    res.status(500).json({ error: 'Failed to get votes' });
  }
});

// Get results by location
router.get('/results/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const today = new Date().toISOString().split('T')[0];
    const votes = await VoteModel.getVotesForLocationMeals(location, today);
    res.json(votes);
  } catch (error) {
    console.error('Get location votes error:', error);
    res.status(500).json({ error: 'Failed to get votes for location' });
  }
});

// Check if user has voted today
router.get('/voted-today', isAuthenticated, async (req, res) => {
  try {
    const hasVoted = await VoteModel.hasUserVotedToday(req.session.userId);
    const vote = hasVoted ? await VoteModel.getUserVoteForToday(req.session.userId) : null;
    
    res.json({
      hasVoted: hasVoted,
      vote: vote
    });
  } catch (error) {
    console.error('Check vote error:', error);
    res.status(500).json({ error: 'Failed to check vote status' });
  }
});

// Vote for a meal (user can change their vote)
router.post('/vote', isAuthenticated, async (req, res) => {
  try {
    const { mealId } = req.body;

    if (!mealId) {
      return res.status(400).json({ error: 'Meal ID required' });
    }

    const voteId = await VoteModel.createOrUpdateVote(req.session.userId, mealId);
    
    res.json({ 
      message: 'Vote submitted successfully',
      voteId: voteId
    });
  } catch (error) {
    console.error('Create vote error:', error);
    res.status(500).json({ error: 'Failed to submit vote' });
  }
});

module.exports = router;
