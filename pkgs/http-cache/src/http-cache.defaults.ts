/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at http://neekware.com/license/MIT.html
 */

import { HttpCacheCfg } from './http-cache.types';

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
