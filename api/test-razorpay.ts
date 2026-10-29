import { getRazorpay } from '../lib/razorpay.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log("Testing Razorpay credentials...");
    const razorpay = getRazorpay();
    // Attempting to fetch a single payment to verify auth
    const payments = await razorpay.payments.all({ count: 1 });
    res.json({ 
      status: "success", 
      message: "Authentication successful", 
      count: payments.items ? payments.items.length : 0 
    });
  } catch (error: any) {
    console.error("Razorpay Auth Test Failed:", error);
    
    // Ensure we send a string message, not an object
    let errorMessage = "Authentication failed";
    let errorDetails = "Unknown error";

    if (typeof error === 'string') {
      errorDetails = error;
    } else if (error && typeof error === 'object') {
      errorDetails = error.description || error.message || JSON.stringify(error);
    }
    
    res.status(401).json({ 
      status: "error", 
      message: errorMessage, 
      details: errorDetails
    });
  }
}
