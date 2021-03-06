import { AppCfg, TargetPlatform, HttpMethod } from '@nwx/cfg';
import { LogLevels } from '@nwx/logger';

export const environment: AppCfg = {
  version: '0.0.1',
  // app name
  appName: '@nwx/http-cache',
  // target (browser, mobile, desktop)
  target: TargetPlatform.web,
  // production, staging or development
  production: false,
  log: {
    // log level (application-wide)
    level: LogLevels.debug
  },
  httpCache: {
    // estimate expiry time of http cache (in seconds)
    ttl: 60,
  }
};
