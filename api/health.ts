import { getRazorpay, getRazorpayKeyId } from '../lib/razorpay.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const razorpay = getRazorpay();
    // Test connection
    await razorpay.orders.all({ count: 1 });
    
    const keyId = getRazorpayKeyId();
    const maskedId = keyId 
      ? `${keyId.substring(0, 8)}...${keyId.substring(keyId.length - 4)}`
      : "(empty)";

    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      razorpay: !!keyId,
      key_id: maskedId,
      mode: keyId.startsWith('rzp_live_') ? 'live' : 'test'
    });
  } catch (error: any) {
    console.error("Health Check Error:", error);
    const keyId = getRazorpayKeyId();
    const maskedId = keyId 
      ? `${keyId.substring(0, 8)}...${keyId.substring(keyId.length - 4)}`
      : "(empty)";
    
    let errorMessage = "Razorpay connection failed";
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object') {
      errorMessage = error.description || error.message || JSON.stringify(error);
    }
      
    res.status(500).json({
      status: "error",
      message: errorMessage,
      key_id: maskedId
    });
  }
}
