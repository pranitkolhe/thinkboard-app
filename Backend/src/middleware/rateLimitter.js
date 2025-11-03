import ratelimit from "../config/upstash.js";

const rateLimitter = async (req,res,next)=>{
    try {
        const {success} = await ratelimit.limit("my-limit-key");
        if(!success){
            return res.status(429).json("Too many requests, Please try again");
        }
        next();
    } catch (error) {
        console.log("Rate limmit error",error);
        next();
    }
}

export default rateLimitter;