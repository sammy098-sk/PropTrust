const express = require('express');
const { Investor, Business } = require('../models/Schemas');
const { auth } = require('../middleware/authMiddleware');
const router = express.Router();

// @route   POST /api/investor
// @desc    Create/Update Investor Profile
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'investor') return res.status(403).json({ msg: 'Not authorized' });

  const { name, minFunding, maxFunding, interestedCategories } = req.body;

  try {
    let investor = await Investor.findOneAndUpdate(
      { user: req.user.id },
      { $set: { user: req.user.id, name, minFunding, maxFunding, interestedCategories } },
      { new: true, upsert: true }
    );
    res.json(investor);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/investor/match
// @desc    Get matched businesses based on preferences
router.get('/match', auth, async (req, res) => {
  try {
    const investor = await Investor.findOne({ user: req.user.id });
    if (!investor) return res.status(404).json({ msg: 'Investor profile not found' });

    // Complex Matching Logic
    const matches = await Business.find({
      status: 'approved',
      category: { $in: investor.interestedCategories },
      fundingGoal: { $gte: investor.minFunding, $lte: investor.maxFunding }
    });

    res.json(matches);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;