# @nwx/http-cache

**A simple http cache module for Angular applications**

[![status-image]][status-link]
[![version-image]][version-link]
[![coverage-image]][coverage-link]
[![download-image]][download-link]

# How to install

    npm i @nwx/http-cache |OR| yarn add @nwx/http-cache

# How to use

```typescript
// In your environment{prod,staging}.ts

import { AppCfg, TargetPlatform } from '@nwx/cfg';
import { LogLevels } from '@nwx/logger';

export const environment: AppCfg = {
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
  http-cache: {
    // estimate expiry time of http cache (in seconds)
    ttl: 60,
  }
};
```

```typescript
// In your app.module.ts

import { CfgModule } from '@nwx/cfg';
import { LoggerModule } from '@nwx/logger';
import { http-cacheModule } from '@nwx/http-cache';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CfgModule.forRoot(environment), // make the environment injectable
    LoggerModule,
    HttpCacheModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

```typescript
// In your app.module.ts

```

# Running the tests

To run the tests against the current environment:

    npm run ci:all

# License

Released under a ([MIT](https://github.com/neekware/nwx-http-cache/blob/master/LICENSE)) license.

# Version

X.Y.Z Version

    `MAJOR` version -- making incompatible API changes
    `MINOR` version -- adding functionality in a backwards-compatible manner
    `PATCH` version -- making backwards-compatible bug fixes

[status-image]: https://secure.travis-ci.org/neekware/nwx-http-cache.png?branch=master
[status-link]: http://travis-ci.org/neekware/nwx-http-cache?branch=master
[version-image]: https://img.shields.io/npm/v/@nwx/http-cache.svg
[version-link]: https://www.npmjs.com/package/@nwx/http-cache
[coverage-image]: https://coveralls.io/repos/neekware/nwx-http-cache/badge.svg
[coverage-link]: https://coveralls.io/r/neekware/nwx-http-cache
[download-image]: https://img.shields.io/npm/dm/@nwx/http-cache.svg
[download-link]: https://www.npmjs.com/package/@nwx/http-cache
