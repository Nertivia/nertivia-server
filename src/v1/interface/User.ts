export interface DBUser {
  id: string
  email: string
  username: string
  discriminator: string
  password_version: number
  password: string
}