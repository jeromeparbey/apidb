// providers/Response/infrastructure/ResponseProvider.ts
import { IResponse, ResponsePayload } from "../domain/IResponse"
import { NextResponse } from "next/server"

export const ResponseProvider: IResponse = <T = any>(
  statusCode: number,
  message: string,
  data?: T
): ResponsePayload<T> => {
  const response: ResponsePayload<T> = {
    succeed: [200, 201].includes(statusCode),
    message,
    ...(data ? { data } : {})
  }

  return response
}
