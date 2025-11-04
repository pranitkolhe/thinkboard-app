import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import dotenv from "dotenv";
dotenv.config();

const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    // 15 requests in 20 seconds
    limiter: Ratelimit.slidingWindow(8,"15 s"),
});

export default ratelimit;