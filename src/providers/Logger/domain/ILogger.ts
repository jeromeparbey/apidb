export interface ILogger {

  info(message: string, meta?: object): void

  warn(message: string, meta?: object): void

  error(message: string, meta?: object): void

  

}
