import bcrypt from "bcryptjs"
import { IHashProvider } from "../domain/IHashProvider"

export class BcryptHashProvider implements IHashProvider {

  private readonly saltRounds = 12

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds)
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

}
