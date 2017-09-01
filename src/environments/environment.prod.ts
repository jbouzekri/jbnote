export const environment = {
  // Enable production environment
  production: true,

  // Configure logging level globally
  // 3 : detail (everything even angular verbose routing debug)
  // 2 : debug (for development purpose)
  // 1 : info (error, warnings and info)
  // 0 : error and warning only (default in production)
  debugLevel: 0,

  get isInfo() {
    return this.debugLevel >= 1;
  },

  get isDebug() {
    return this.debugLevel >= 2;
  },

  get isDetail() {
    return this.debugLevel >= 3;
  }
};
