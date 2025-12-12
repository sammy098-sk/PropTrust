const mongoose = require('mongoose');

// --- User Schema ---
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['business', 'investor', 'admin'], required: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: { type: Date, default: Date.now }
});

// --- Business Profile Schema ---
const BusinessSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  pitchDeckUrl: { type: String }, // URL to PDF
  financialsUrl: { type: String }, // URL to Doc
  fundingGoal: { type: Number, required: true },
  equityOffered: { type: Number, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'suspended'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

// --- Investor Profile Schema ---
const InvestorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  bio: String,
  minFunding: { type: Number, default: 0 },
  maxFunding: { type: Number, default: 10000000 },
  interestedCategories: [{ type: String }],
  status: { type: String, enum: ['active', 'suspended'], default: 'active' }
});

// --- Message/Chat Schema ---
const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Business = mongoose.model('Business', BusinessSchema);
const Investor = mongoose.model('Investor', InvestorSchema);
const Message = mongoose.model('Message', MessageSchema);

module.exports = { User, Business, Investor, Message };