/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at http://neekware.com/license/MIT.html
 */

import { Injectable } from '@angular/core';

import { get, merge } from 'lodash';
import { CfgService, AppCfg } from '@nwx/cfg';
import { LogService } from '@nwx/logger';

import { DefaultHttpCacheCfg } from './http-cache.defaults';
import { HttpCacheModule } from './http-cache.module';

/**
 * An injectable class that handles HttpCache service
 */
@Injectable({
  providedIn: 'root'
})
export class HttpCacheService {
  private _options: AppCfg = null;

  /**
   * Class constructor
   * @param options an optional configuration object
   */
  constructor(private cfg: CfgService, private log: LogService) {
    this._options = merge({ httpCache: DefaultHttpCacheCfg }, cfg.options);
    this.log.debug('HttpCacheService ready ...');
  }

  get options() {
    return this._options;
  }
}
