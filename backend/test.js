// This script simulates Razorpay sending a perfect webhook
fetch('http://localhost:5000/api/webhook/razorpay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        event: "payment.failed",
        payload: {
            payment: {
                entity: {
                    id: "pay_demo001",
                    amount: 500000,
                    error_description: "insufficient_funds",
                    notes: { customer_name: "Naman Sharma" }
                }
            }
        }
    })
})
.then(response => response.json())
.then(data => console.log("Server Response:", data))
.catch(error => console.error("Request Failed:", error));