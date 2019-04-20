import { AppCfg, TargetPlatform, HttpMethod } from '@nwx/cfg';
import { LogLevels } from '@nwx/logger';

export const environment: AppCfg = {
  // app name
  appName: '@nwx/http-cache',
  // target (browser, mobile, desktop)
  target: TargetPlatform.web,
  // production, staging or development
  production: true,
  log: {
    // log level (application-wide)
    level: LogLevels.debug
  },
  httpCache: {
    // estimate expiry time of http cache (in seconds)
    ttl: 60,
  }
};
