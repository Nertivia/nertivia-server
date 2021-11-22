export interface User {
  id: string
  email: string
  username: string
  discriminator: string
  password_version: number
  password: string
}