// lib/redis.ts
import Redis from "ioredis";

export const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
});

redisClient.on("error", (err : any) => console.log("redis client error", err));
redisClient.on("connect", (err : any) => console.log("Redis Client Connected" , err));
redisClient.on("ready", (err : any) => console.log("Redis Client Ready", err));
