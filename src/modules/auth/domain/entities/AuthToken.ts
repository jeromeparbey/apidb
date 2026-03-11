export class AuthToken {

  public accessToken: string
  public expiresIn: string

  constructor(
    accessToken: string,
    expiresIn: string
  ) {

    this.accessToken = accessToken
    this.expiresIn = expiresIn

  }

}
