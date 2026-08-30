const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const Transaction = require('./models/Transaction');
const { analyzeFailedPayment } = require('./services/recoveryAgent');

const app = express();
app.use(cors());
app.use(express.json());

// connect to local or cloud database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('connected to mongodb'))
  .catch((err) => console.error('mongodb connection error:', err));

// webhook listener
app.post('/api/webhook/razorpay', async (req, res) => {
    try {
        const { event, payload } = req.body;
        
        if (event === 'payment.failed') {
            const paymentData = payload.payment.entity;
            const paymentId = paymentData.id;
            const amount = paymentData.amount / 100;
            const failureReason = paymentData.error_description || 'unknown error';
            const customerName = paymentData.notes?.customer_name || 'Test User';

            console.log(`payment failed: id ${paymentId}, amount: ${amount}, reason: ${failureReason}`);
            console.log('asking ai for recovery plan...');
            
            // call the ai brain
            const aiDecision = await analyzeFailedPayment({
                customerName,
                amount,
                failureReason,
                paymentId
            });

            console.log('ai decision received:', aiDecision);

            // save the transaction and ai plan to database
            const transaction = new Transaction({
                customerName,
                razorpayPaymentId: paymentId,
                amount,
                status: aiDecision.requiresHumanApproval ? 'pending_approval' : 'failed',
                failureReason,
                rootCause: aiDecision.rootCause,
                actionType: aiDecision.actionType,
                retryDelayHours: aiDecision.retryDelayHours,
                customerMessage: aiDecision.customerMessage,
                requiresHumanApproval: aiDecision.requiresHumanApproval,
                recoveryStrategy: aiDecision.recoveryStrategy
            });

            await transaction.save();
            console.log('saved ai recovery plan to mongodb');
        }

        res.status(200).json({ status: 'ok' });
    } catch (error) {
        console.error('webhook error:', error);
        res.status(500).json({ error: 'server error' });
    }
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});