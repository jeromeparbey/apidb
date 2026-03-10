export interface UpdateUserDTO {
  id: string
  name?: string
  email?: string
  role?: "USER" | "ADMIN"
}
