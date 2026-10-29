import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables and override container defaults if set
dotenv.config({ override: true });

// Import Vercel handlers for local development
import healthHandler from "./api/health.js";
import testRazorpayHandler from "./api/test-razorpay.js";
import createOrderHandler from "./api/create-order.js";
import sendLeadHandler from "./api/send-lead.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Local API Routes - Mapping Vercel handlers to Express for AI Studio preview
  // This allows the app to work locally while remaining Vercel-compatible
  app.all("/api/health", (req, res) => healthHandler(req, res));
  app.all("/api/test-razorpay", (req, res) => testRazorpayHandler(req, res));
  app.all("/api/create-order", (req, res) => createOrderHandler(req, res));
  app.all("/api/send-lead", (req, res) => sendLeadHandler(req, res));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode (or Vercel environment)
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Only start the listener if we're not on Vercel
  // Vercel handles the routing and execution of /api files automatically
  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Local development server running on http://localhost:${PORT}`);
      console.log(`API routes are being served from the /api directory`);
    });
  }
}

startServer();

export default {};
