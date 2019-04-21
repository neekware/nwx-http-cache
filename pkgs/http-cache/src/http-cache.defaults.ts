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
  // estimate expiry time of http cache (in seconds)
  ttl: 60
};
