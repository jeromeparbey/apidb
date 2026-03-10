export interface IJwtProvider {

  sign(payload: object): Promise<string>

  verify<T>(token: string): Promise<T>

}
