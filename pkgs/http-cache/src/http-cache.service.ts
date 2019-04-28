/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at http://neekware.com/license/MIT.html
 */

import { Injectable } from '@angular/core';

import { get as ldGet, merge as ldMerge } from 'lodash';
import { CfgService, AppCfg } from '@nwx/cfg';
import { LogService } from '@nwx/logger';

import { DefaultHttpCacheCfg } from './http-cache.defaults';
import { HttpCacheModule } from './http-cache.module';
import { HttpResponse } from '@angular/common/http';
import { HttpCacheUniqueMeta } from './http-cache.types';

/**
 * An injectable class that handles HttpCache service
 */
@Injectable({
  providedIn: 'root'
})
export class HttpCacheService {
  private cache = new Map<string, HttpResponse<any>>();
  private options: AppCfg;

  constructor(private cfg: CfgService, private log: LogService) {
    this.options = ldMerge({ httpCache: DefaultHttpCacheCfg }, cfg.options);
    this.log.debug('HttpCacheService ready ...');
  }

  get(key: string): HttpResponse<any> {
    return this.cache.get(key);
  }

  set(key: string, value: HttpResponse<any>) {
    this.cache.set(key, value);
    this.setStore(key, value);
  }

  private setStore(key: string, value: HttpResponse<any>) {}

  uniqueKey(uniqueMeta: HttpCacheUniqueMeta): string {
    const tokens: string[] = [];
    Object.keys(uniqueMeta)
      .sort()
      .forEach(key => {
        tokens.push(`${key}:${uniqueMeta[key]}`);
      });

    if (tokens.length < 1) {
      throw Error('Invalid uniqueMeta');
    }

    const cacheKey = tokens.join('::');
    return cacheKey;
  }
}
