declare module Express {
  export interface Request {
      user: import('./v1/interface/User').User;
  }
}