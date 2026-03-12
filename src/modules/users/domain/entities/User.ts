// domain/entities/User.ts

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export class User {
  public readonly id: string
  public name: string
  public email: string
  public password: string
  public role: UserRole
  public twoFactorEnabled: boolean
  public twoFactorSecret?: string
  public createdAt: Date
  public updatedAt: Date

  constructor(props: {
    id: string
    name: string
    email: string
    password: string
    role?: UserRole
    twoFactorEnabled?: boolean
    twoFactorSecret?: string
    createdAt?: Date
    updatedAt?: Date
  }) {
    this.id = props.id
    this.name = props.name
    this.email = props.email
    this.password = props.password
    this.role = props.role ?? UserRole.USER
    this.twoFactorEnabled = props.twoFactorEnabled ?? false
    this.twoFactorSecret = props.twoFactorSecret
    this.createdAt = props.createdAt ?? new Date()
    this.updatedAt = props.updatedAt ?? new Date()
  }

}
