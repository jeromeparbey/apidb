
export interface IResponse {
  <T = any>(statusCode: number, message: string, data?: T): ResponsePayload<T>
}

export interface ResponsePayload<T = any> {
  succeed: boolean
  message: string
  data?: T
}
