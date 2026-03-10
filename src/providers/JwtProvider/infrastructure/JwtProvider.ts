import jwt from "jsonwebtoken"
import { IJwtProvider } from "../domain/IJwtProvider"

export class JwtProvider implements IJwtProvider {

  private readonly secret = process.env.JWT_SECRET as string
  private readonly expiresIn = "1h"

  async sign(payload: object): Promise<string> {

    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn
    })

  }

  async verify<T>(token: string): Promise<T> {

    return jwt.verify(token, this.secret) as T

  }

}
