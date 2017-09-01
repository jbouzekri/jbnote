// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  // Enable production environment
  production: false,

  // Configure logging level globally
  // 3 : detail (everything even angular verbose routing debug)
  // 2 : debug (for development purpose)
  // 1 : info (error, warnings and info)
  // 0 : error and warning only (default in production)
  debugLevel: 2,

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
