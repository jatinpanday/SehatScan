export {};

declare global {
  namespace Express {
    interface Request {
      /** Set by `requireAuth` after a valid JWT */
      userId?: string;
      userEmail?: string;
    }
  }
}
