const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);


const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json()); // allow json parsing for webhooks

// connect to local database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('connected to mongodb'))
  .catch((err) => console.error('mongodb connection error:', err));

// webhook route to catch failed payments from razorpay
app.post('/api/webhook/razorpay', async (req, res) => {
    try {
        const { event, payload } = req.body;
        
        // check if this is a payment failure event
        if (event === 'payment.failed') {
            const paymentData = payload.payment.entity;
            const paymentId = paymentData.id;
            const amount = paymentData.amount / 100; // convert paise to rupees
            const failureReason = paymentData.error_description || 'unknown error';

            console.log(`payment failed: id ${paymentId}, amount: ${amount}, reason: ${failureReason}`);
            
            // future step: trigger ai logic here
        }

        // respond with 200 ok so razorpay knows we got the event
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