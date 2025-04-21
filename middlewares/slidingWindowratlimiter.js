import client from "../database/redisdb.js";
import { randomUUID } from "crypto";
const slidingWindowRateLimiter = async (req, res, next) => {
  try {
    const ip = req.ip;
    const key = `rateLimiter:${ip}`;
    const now = Date.now(); // milliseconds
    const windowStart = now - 60 * 1000;

    //!1.Remove old login attempts
    // Deletes all entries from Redis sorted set for this IP that are older than 60 seconds.
    // removes all members in the Redis Sorted Set where the score is between min and max (inclusive)
    //  ZREMRANGEBYSCORE key min max
    await client.zRemRangeByScore(key, 0, windowStart);

    //!2. Count login attempts in last 60 seconds
    // ZCOUNT: Count how many login attempts happened between windowStart and now → last 60 seconds.
    //This gives us the number of requests made within our sliding window.
    const count = await client.zCount(key, windowStart, now);

    if (count >= 5) {
      return res.status(429).send("Too many login attempts. Try again later.");
    }

    //!3.Add this login attempt

    //ZADD adds a new entry where:
    // Score = timestamp
    // Value = a unique string like "1713693600000-0.48751" (timestamp + random number to avoid duplicates)
    //  This helps us remember that this IP made a request at this time.
    // zadd(key, score, value)

    //! await client.zAdd(key, [{ score: now, value: `${now}-${Math.random()}` }]);
    // The Math.random() function, while great for general use, is not cryptographically strong and could, under very high concurrency, generate duplicate values, especially when paired with the same timestamp (now).

    // So yeah — if 100 requests hit at exactly the same millisecond, and Math.random() happens to return the same value (which is possible), you might get duplicate members in your Redis Sorted Set, and that’s what we want to avoid in a rate limiter.

    await client.zAdd(key, [{ score: now, value: `${now}-${randomUUID()}` }]);
    //! more alternative
    // const uniqueID = await client.incr(`rateLimiter:counter:${ip}`);
    // await client.zAdd(key, [{ score: now, value: `${now}-${uniqueID}` }]);
    // client.incr(...)
    // This line tells Redis: "Increase the number stored at this key by 1."
    // If the key doesn’t exist yet, Redis starts at 0 and makes it 1.
    // Every time a request from the same IP hits this line, the number increases: 1, 2, 3, ...

    // 4. Optional expiry (cleanup if user inactive)
    await client.expire(key, 60);
    next();
  } catch (error) {
    console.error("Rate limiter error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error in rate limiter.",
    });
  }
};

export default slidingWindowRateLimiter;
