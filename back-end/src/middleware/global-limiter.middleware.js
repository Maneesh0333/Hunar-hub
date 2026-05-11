import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins

  max: 100,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },

  skipSuccessfulRequests: false,

  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many requests from this IP. Please try again later.",
    });
  },
});