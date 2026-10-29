import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Razorpay = require('razorpay');

/**
 * Lazy initialization for Razorpay client.
 * This prevents the app from crashing on startup if the keys are missing.
 */
let razorpayInstance: any = null;

export function getRazorpay(): any {
  if (!razorpayInstance) {
    const raw_id = process.env.RAZORPAY_KEY_ID || '';
    const raw_secret = process.env.RAZORPAY_KEY_SECRET || '';
    const key_id = raw_id.trim();
    const key_secret = raw_secret.trim();

    console.log(`[Diagnostic] RAZORPAY_KEY_ID: Raw length=${raw_id.length}, Trimmed length=${key_id.length}`);
    console.log(`[Diagnostic] RAZORPAY_KEY_SECRET: Raw length=${raw_secret.length}, Trimmed length=${key_secret.length}`);
    
    // Masked log of secret for verification
    if (key_secret) {
      console.log(`[Diagnostic] Masked secret: ${key_secret.substring(0, 3)}...${key_secret.substring(key_secret.length - 3)}`);
    }

    if (!key_id || !key_secret) {
      console.error('Razorpay keys missing in environment variables');
      throw new Error('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing in environment variables');
    }

    // Masked logging for debugging
    const maskedId = `${key_id.substring(0, 4)}...${key_id.substring(key_id.length - 4)}`;
    console.log(`Initializing Razorpay with Key ID: ${maskedId}`);

    try {
      // With createRequire, Razorpay should be the constructor directly
      console.log('Razorpay type:', typeof Razorpay);
      
      if (typeof Razorpay !== 'function') {
        // If it's still not a function, try to get the default or the whole module
        const Constructor = Razorpay.default || Razorpay;
        console.log('Constructor type:', typeof Constructor);
        
        if (typeof Constructor !== 'function') {
          throw new Error(`Razorpay constructor is not a function (got ${typeof Constructor})`);
        }
        
        razorpayInstance = new Constructor({
          key_id,
          key_secret,
        });
      } else {
        razorpayInstance = new Razorpay({
          key_id,
          key_secret,
        });
      }
      
      console.log('Razorpay client initialized successfully');
    } catch (err: any) {
      console.error('Failed to initialize Razorpay client:', err.message);
      throw new Error(`Razorpay initialization failed: ${err.message}`);
    }
  }
  return razorpayInstance;
}

export function getRazorpayKeyId(): string {
  return (process.env.RAZORPAY_KEY_ID || '').trim();
}
