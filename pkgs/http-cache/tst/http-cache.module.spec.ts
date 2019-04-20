/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at http://neekware.com/license/MIT.html
 */

import { HttpCacheModule } from "../src/http-cache.module";

describe("HttpCacheModule", () => {
  let httpCacheModule: HttpCacheModule;

  beforeEach(() => {
    httpCacheModule = new HttpCacheModule();
  });

  it("should create an instance", () => {
    expect(httpCacheModule).toBeTruthy();
  });
});
