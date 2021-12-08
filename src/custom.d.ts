declare namespace Express {
  export interface Request {
      cache: import('./v1/cache/userCache').CacheUser
  }
}