export interface UpdateUserDTO {
  id: string               
  name?: string
  email?: string
  password?: string
  role?: "USER" | "ADMIN"
  twoFactorEnabled?: boolean
  twoFactorSecret?: string
}