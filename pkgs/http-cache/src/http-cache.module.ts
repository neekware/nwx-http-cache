/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at http://neekware.com/license/MIT.html
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpCacheService } from './http-cache.service';

/**
 * HttpCache module class
 */
@NgModule({
  imports: [CommonModule],
  providers: [HttpCacheService],
})
export class HttpCacheModule {}
