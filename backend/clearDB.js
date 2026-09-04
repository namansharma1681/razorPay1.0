const mongoose = require('mongoose');
require('dotenv').config();
const Transaction = require('./models/Transaction');

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        await Transaction.deleteMany({});
        console.log("✅ Database wiped clean! Ready for demo.");
        process.exit(0);
    })
    .catch(err => {
        console.error("Error connecting:", err);
        process.exit(1);
    });