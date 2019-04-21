/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at http://neekware.com/license/MIT.html
 */

import { isFunction } from '../src/http-cache.utils';

describe('HttpCache Utils', function() {
  it('should isFunction return true', function() {
    expect(isFunction(() => {})).toBe(true);
  });
  it('should isFunction return false', function() {
    expect(isFunction({})).toBe(false);
  });
});
