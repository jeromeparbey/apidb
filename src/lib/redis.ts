import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config(); 

export const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
   maxRetriesPerRequest: 5, // réduit le nombre de tentatives
  connectTimeout: 10000,   // temps avant timeout
});

redisClient.on("error", (err : any) => console.log("redis client error", err));
redisClient.on("connect", () => console.log("Redis Client Connected" ));
redisClient.on("ready", () => console.log("Redis Client Ready"));
