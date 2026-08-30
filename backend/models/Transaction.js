const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  customerName: { type: String, default: 'Customer' },
  razorpayPaymentId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'failed' },
  failureReason: { type: String, required: true },
  
  // fields to store the AI's decisions
  rootCause: { type: String },
  actionType: { type: String },
  retryDelayHours: { type: Number, default: 0 },
  customerMessage: { type: String },
  requiresHumanApproval: { type: Boolean, default: false },
  recoveryStrategy: { type: String },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);