import { getRazorpay } from '../lib/razorpay.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const razorpay = getRazorpay();
    
    if (!req.body) {
      return res.status(400).json({ error: "Request body is missing" });
    }

    const { amount, currency, receipt } = req.body;
    
    console.log(`Creating order for amount: ${amount} ${currency || 'INR'}, Receipt: ${receipt}`);

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    // Razorpay receipt ID has a max length of 40 characters
    const finalReceipt = (receipt || `rcpt_${Date.now()}`).substring(0, 40);

    const options = {
      amount: Math.round(Number(amount) * 100), // amount in the smallest currency unit
      currency: currency || "INR",
      receipt: finalReceipt,
    };

    let order;

    order = await razorpay.orders.create(options);
    if (!order || !order.id) {
      throw new Error("Razorpay returned an invalid order response object");
    }

    console.log("Order processed successfully:", order.id);
    res.json({
      ...order,
      is_mock: false
    });
  } catch (error: any) {
    console.error("Razorpay Order Creation Error:", error);
    
    // Ensure we send a string message, not an object
    let errorMessage = "Internal Server Error";
    let errorCode = "INTERNAL_SERVER_ERROR";

    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object') {
      // Razorpay errors often have a description or message field
      errorMessage = error.description || error.message || JSON.stringify(error);
      errorCode = error.code || "RAZORPAY_ERROR";
    }

    res.status(500).json({ 
      error: errorMessage,
      details: errorCode
    });
  }
}
