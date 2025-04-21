import client from "../database/redisdb.js";

/**
 * Rate limiter middleware that implements:
 * 1. Immediate cooldown (5-second delay between requests)
 * 2. Hourly rate limit (10 requests per hour)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const rateLimiter = async (req, res, next) => {
  try {
    // Get client IP address
    const ip = req.ip;
    console.log("Client IP:", ip);

    // --- Cooldown Check (5-second delay between requests) ---
    const cooldownKey = `cooldown:${ip}`;
    
    // Try to set the cooldown key with 5-second expiration if it doesn't exist
    const cooldownSet = await client.set(cooldownKey, 1, {
      EX: 5,    // Expire after 5 seconds
      NX: true   // Only set if key doesn't exist
    });
    
    // If key already exists (cooldownSet is false), reject the request
    if (!cooldownSet) {
      return res.status(429).json({
        message: "You're sending requests too quickly. Please wait 5 seconds.",
        success: false
      });
    }

    // --- Rate Limit Check (10 requests per hour) ---
    const rateKey = `rate:${ip}`;
    
    // Increment the request count for this IP
    const count = await client.incr(rateKey);
    console.log("Current request count:", count);
    
    // If this is the first request in the current window, set expiration
    if (count === 1) {
      await client.expire(rateKey, 3600); // 1 hour window (3600 seconds)
    }
    
    // If request count exceeds the limit, reject the request
    if (count > 10) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again after an hour.",
      });
    }

    // If all checks pass, proceed to the next middleware
    next();
  } catch (error) {
    console.error("Rate limiter error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error in rate limiter.",
    });
  }
};

export default rateLimiter;