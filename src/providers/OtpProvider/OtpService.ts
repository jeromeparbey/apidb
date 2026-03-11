import crypto from "crypto"

export class OtpService {

  private readonly otpLength = 6
  private readonly expiresInMinutes = 5

  generateOtp(): string {

    let otp = ""

    for (let i = 0; i < this.otpLength; i++) {
      otp += crypto.randomInt(0, 10)
    }

    return otp
  }

  getExpirationDate(): Date {
    return new Date(Date.now() + this.expiresInMinutes * 60 * 1000)
  }

}
