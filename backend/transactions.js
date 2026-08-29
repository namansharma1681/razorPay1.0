const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  razorpayPaymentId: { type: String }, // The ID sent by the webhook
  amount: { type: Number, required: true },
  status: { type: String, enum: ['failed', 'recovered', 'processing'], default: 'failed' },
  failureReason: { type: String, required: true }, 
  
  // AI Tracking Metrics
  aiActionTaken: { type: String, default: 'Pending AI Analysis' }, 
  recoveryScheduledAt: { type: Date }, 
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);