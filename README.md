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
// In your app.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Neekware';
  options = {};
  destroy$ = new Subject();

  constructor(
    private http: HttpClient,
    private httpCache: HttpCacheService
  ) {
    this.title = this.cfg.options.appName;
    console.log('AppComponent loaded ...');
  }

  ngOnInit() {
    // create a state path into our store - also used as internal cache key
    const userStatePath = new OrderedStatePath().append('user', 1).toString());

    // select on the state path to be notified of any change
    this.httpCache.store
      .select<User>(userStatePath)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: user => {
          console.log('User via Select', user);
        },
      });

      this.makeUserRequest(1); // calls the api
      
      setTimeout(() => {
        this.makeUserRequest(1); // uses the cache response
      }, 4)

      setTimeout(() => {
        this.makeUserRequest(1); // calls the api
      }, 6)
  }

  makeUserRequest(id: string) {
    const cacheKey = new OrderedStatePath().append('user', id).toString();
    const httpHeaders = addMetaToHttpHeaders({
      policy: HttpCacheFetchPolicy.CacheFirst,
      key: cacheKey,
      ttl: 5,
    });

    this.http.get<User>(`/api/user/${id}`, { headers: httpHeaders })
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
      console.log('User via Http', user);
    });
  }

  ngOnDestroy() {
    this.destory$.next();
    this.destroy$.complete();
  }
}
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

# Sponsors

[Surge](https://github.com/surgeforward)
