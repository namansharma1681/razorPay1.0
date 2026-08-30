const { GoogleGenAI } = require('@google/genai');

// initialize gemini client with your api key from the .env file
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// this function sends the failed payment details to the AI
async function analyzeFailedPayment({ customerName, amount, failureReason, paymentId }) {
    try {
        const prompt = `
You are an autonomous fintech revenue recovery engine for Razorpay.
Analyze this failed payment and output a structured recovery decision.

Transaction Details:
- Customer Name: ${customerName}
- Amount: ₹${amount}
- Failure Reason: ${failureReason}
- Payment ID: ${paymentId}

Decision Rules:
1. If error is "insufficient_funds": schedule retry for 24 hours later, send polite WhatsApp message with payment link.
2. If error is "card_expired": send immediate WhatsApp message asking to update card.
3. If error is "bank_down" or "gateway_timeout": schedule silent retry in 2 hours, no immediate user notification.
4. If amount is greater than 25000: set requiresHumanApproval to true.

Reply in ONLY pure JSON format matching this exact structure, with no extra text or markdown:
{
  "rootCause": "string",
  "actionType": "SILENT_RETRY or USER_OUTREACH or MANUAL_REVIEW",
  "retryDelayHours": number,
  "customerMessage": "write a personalized message with link https://rzp.io/i/${paymentId}",
  "requiresHumanApproval": boolean,
  "recoveryStrategy": "short explanation of the plan"
}
        `;

        // send the prompt to gemini
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        // clean up the AI's text response and turn it into a javascript object
        let text = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(text);

    } catch (error) {
        console.error('ai agent error, using fallback strategy:', error.message);
        // if the AI fails or internet drops, we use this safe backup plan
        return {
            rootCause: failureReason,
            actionType: 'USER_OUTREACH',
            retryDelayHours: 24,
            customerMessage: `Hi ${customerName}, your payment of ₹${amount} failed. Please complete it here: https://rzp.io/i/${paymentId}`,
            requiresHumanApproval: amount > 25000,
            recoveryStrategy: 'Standard fallback retry rule'
        };
    }
}

module.exports = { analyzeFailedPayment };