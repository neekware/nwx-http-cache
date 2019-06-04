/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at http://neekware.com/license/MIT.html
 */

import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

import { merge as ldMerge, setWith as ldSetWith } from 'lodash';
import { CfgService, AppCfg } from '@nwx/cfg';
import { LogService } from '@nwx/logger';

import {
  DefaultHttpCacheCfg,
  DefaultMaxCacheExpiry,
} from './http-cache.defaults';
import { HttpCacheEntry, StoreType } from './http-cache.types';
import { CacheStore } from './http-cache.store';

/**
 * An injectable class that handles HttpCache service
 */
@Injectable({
  providedIn: 'root',
})
export class HttpCacheService {
  private cacheStore = new CacheStore({});
  private appOptions: AppCfg;
  private cacheMap = new Map<string, HttpCacheEntry>();

  constructor(private cfg: CfgService, private log: LogService) {
    this.appOptions = ldMerge({ httpCache: DefaultHttpCacheCfg }, cfg.options);
    this.log.debug('HttpCacheService ready ...');
  }

  get store() {
    return this.cacheStore;
  }

  get options() {
    return this.appOptions;
  }

  /**
   * Returns an unexpired cache response or null
   * @param key Cache key
   */
  get(key: string): HttpResponse<any> {
    const entry = this.cacheMap.get(key);
    if (!entry) {
      return null;
    }
    if (this.isExpired(entry)) {
      this.cacheMap.delete(entry.key);
      return null;
    }
    return entry.response;
  }

  /**
   * Caches a http response
   * @param key Cache key
   * @param ttl Cache expiry in seconds
   * @param http response
   */
  set(key: string, ttl = 0, response: HttpResponse<any>) {
    ttl = ttl === 0 ? DefaultMaxCacheExpiry : ttl;
    const entry: HttpCacheEntry = {
      key,
      response,
      expiryTime: Date.now() + ttl * 1000,
    };
    this.cacheMap.set(key, entry);
    const partialState = ldSetWith({}, key, entry.response.body, Object);
    this.store.setState(partialState);
    this.pruneCache();
  }

  /**
   * Returns true if cache is expired, else return false
   * @param entry Cache Entry
   */
  private isExpired(entry: HttpCacheEntry): boolean {
    return entry.expiryTime <= Date.now();
  }

  /**
   * Removes expired cache entries
   */
  private pruneCache() {
    this.cacheMap.forEach(entry => {
      if (this.isExpired(entry)) {
        this.cacheMap.delete(entry.key);
      }
    });
  }
}
