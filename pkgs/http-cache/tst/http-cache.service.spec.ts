/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at http://neekware.com/license/MIT.html
 */

import { TestBed, inject } from "@angular/core/testing";

import { CfgModule } from "@nwx/cfg";
import { LogModule } from "@nwx/logger";

import { HttpCacheModule } from "../src/http-cache.module";
import { HttpCacheService } from "../src/http-cache.service";

describe("HttpCacheService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CfgModule.forRoot(), LogModule, HttpCacheModule]
    });
  });

  it(
    "should be created with default values",
    inject([HttpCacheService], (service: HttpCacheService) => {
      expect(service["options"].httpCache.ttl).toBe(60);
    })
  );

  it(
    "should be created",
    inject([HttpCacheService], (service: HttpCacheService) => {
      expect(service).toBeTruthy();
    })
  );
});
