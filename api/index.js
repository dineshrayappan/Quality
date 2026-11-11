import app from "../server/src/server.js";

/** Ensure the Express app always receives the /api prefix on Vercel rewrites. */
export default function handler(req, res) {
  if (req.url && !req.url.startsWith("/api")) {
    req.url = req.url === "/" ? "/api" : `/api${req.url}`;
  }
  return app(req, res);
}

