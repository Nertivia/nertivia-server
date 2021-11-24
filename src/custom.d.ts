declare namespace Express {
  export interface Request {
      user: Partial<import('./v1/interface/User').User> & {id: string};
  }
}