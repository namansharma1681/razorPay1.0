# Razorpay AI Revenue Recovery System
By Naman Sharma

## Overview
When online payments fail due to bank issues or insufficient funds, businesses often lose the sale because manual follow-ups are too slow. This project is an AI-powered revenue recovery system built for the Razorpay AI Buildathon. 

It automatically intercepts failed transactions using Razorpay webhooks, analyzes the failure reason using Google Gemini, and generates a personalized recovery message for the customer. Business owners can review and execute these AI-generated strategies from a central dashboard.

## Tech Stack
* Backend: Node.js, Express.js
* Database: MongoDB
* Frontend: React, Vite, Tailwind CSS
* AI Integration: Google Gemini API

## System Architecture
1. Webhook Listener: The Node.js backend listens for the 'payment.failed' event from Razorpay.
2. AI Processing: The failure payload (amount, customer details, error code) is passed to Gemini, which acts as an autonomous agent to diagnose the root cause and draft a recovery message.
3. Data Storage: The transaction and AI strategy are saved to MongoDB.
4. Client Dashboard: The React frontend pulls the data, allowing a human manager to review the failed payment and click "Execute" to update the database state to 'recovered'.

## Local Setup Instructions

1. Clone the repository
git clone https://github.com/namansharma1681/razorPay1.0
cd razorPay1.0

2. Setup Environment Variables
Create a .env file inside the /backend directory and add your credentials:
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
GEMINI_API_KEY=<your_google_gemini_key>

3. Install Dependencies and Run
You will need two terminal windows to run both servers simultaneously.

Terminal 1 (Backend):
cd backend
npm install
node server.js

Terminal 2 (Frontend):
cd frontend
npm install
npm run dev

The backend will run on port 5000, and the frontend will be accessible at http://localhost:5173.

## Technical Challenges Faced
While building this, I encountered two main challenges:

First, connecting the Vite frontend to the Express backend initially caused CORS (Cross-Origin Resource Sharing) blocks. I resolved this by properly configuring the CORS middleware in Express to accept requests from localhost:5173.

Second, making the AI output reliable data for the frontend was tricky. Initially, Gemini would return long, conversational paragraphs that broke my frontend UI. I fixed this by engineering a strict prompt that forces the AI to return data in a consistent format (root cause, action type, and customer message), which allowed the React dashboard to render it cleanly.