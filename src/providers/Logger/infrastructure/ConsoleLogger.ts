// providers/Logger/infrastructure/ConsoleLogger.ts
import { ILogger } from "../domain/ILogger"

export class ConsoleLogger implements ILogger {

  info(message: string, meta?: object) {
    console.log(`[INFO] ${message}`, meta ? meta : "")
  }

  warn(message: string, meta?: object) {
    console.warn(`[WARN] ${message}`, meta ? meta : "")
  }

  error(message: string, meta?: object) {
    console.error(`[ERROR] ${message}`, meta ? meta : "")
  }



}
