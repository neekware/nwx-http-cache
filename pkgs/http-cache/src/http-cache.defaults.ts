/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at http://neekware.com/license/MIT.html
 */

import { HttpCacheCfg, HttpCacheFetchPolicy } from './http-cache.types';

/**
 * Default configuration - HttpCache module
 */
export const DefaultHttpCacheCfg: HttpCacheCfg = {
  // by default cache is disabled
  disabled: true,

  // by default, expiry time of http cache is 60 seconds
  ttl: 60,
};

/**
 * Default interpolation options
 */
export const DefaultInterpolationOptions = {
  singleSpace: true,
  trim: true,
};

/**
 * Enabled fetch policy
 */
export const DefaultFetchPolicies = [
  HttpCacheFetchPolicy.CacheOff,
  HttpCacheFetchPolicy.CacheFirst,
  HttpCacheFetchPolicy.CacheOnly,
  HttpCacheFetchPolicy.NetworkOnly,
  HttpCacheFetchPolicy.NetworkFirst,
  HttpCacheFetchPolicy.ChacheAndNetwork,
];

/**
 * Default fetch policy
 */
export const DefaultFetchPolicy = HttpCacheFetchPolicy.CacheFirst;

/**
 * Max cache is one month
 */
export const DefaultMaxCacheExpiry = 60 * 60 * 24 * 30;
