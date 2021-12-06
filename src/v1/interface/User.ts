export interface User {
  id: string
  email: string
  username: string
  discriminator: string
  passwordVersion: number
  password: string
}