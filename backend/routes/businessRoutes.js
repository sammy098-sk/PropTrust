const express = require('express');
const { Business } = require('../models/Schemas');
const { auth } = require('../middleware/authMiddleware');
const router = express.Router();

// @route   POST /api/business
// @desc    Create or Update Business Profile
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'business') return res.status(403).json({ msg: 'Not authorized' });

  const { name, category, description, fundingGoal, equityOffered, location, pitchDeckUrl } = req.body;

  try {
    let business = await Business.findOne({ user: req.user.id });
    
    const businessFields = {
      user: req.user.id,
      name, category, description, fundingGoal, equityOffered, location, pitchDeckUrl
    };

    if (business) {
      business = await Business.findOneAndUpdate(
        { user: req.user.id },
        { $set: businessFields },
        { new: true }
      );
      return res.json(business);
    }

    business = new Business(businessFields);
    await business.save();
    res.json(business);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/business
// @desc    Get all businesses (Filtered for investors)
router.get('/', auth, async (req, res) => {
  try {
    const businesses = await Business.find({ status: 'approved' }).populate('user', ['email']);
    res.json(businesses);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;