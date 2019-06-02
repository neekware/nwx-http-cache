/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at http://neekware.com/license/MIT.html
 */

import { isFunction, interpolate, OrderedStatePath } from '../src/http-cache.utils';

describe('HttpCache Utils', () => {
  it('should isFunction return true', () => {
    expect(isFunction(() => {})).toBe(true);
  });

  it('should isFunction return false', () => {
    expect(isFunction({})).toBe(false);
  });

  it('should interpolate without any params', () => {
    const input = 'some.foo.bar.thingy';
    const output = interpolate(input, {});
    expect(output).toBe(input);
  });

  it('should ordered state path throw error for empty key or value', () => {
    const statePath = new OrderedStatePath();
    expect(() => statePath.append('', 'empty')).toThrow(
      new Error('Error: empty key is not allowed!')
    );
    expect(() => statePath.append('empty', '')).toThrow(
      new Error('Error: empty value is not allowed!')
    );
  });

  it('should create a specific ordered state path', () => {
    const state = {
      userId: {
        '[1000]': {
          portfolio: {
            '[2]': {
              ticker: {
                '[TSLA]': {}, // <-- Match this specific ticker's location in the state/store object
                '[GOOG]': {},
                '[INTL]': {},
                '[APPL]': {},
              },
            },
          },
        },
      },
    };
    const statePath = new OrderedStatePath()
      .append('userId', 1000)
      .append('portfolio', 2)
      .append('ticker', 'TSLA')
      .toString();

    const expectedStatePath = 'userId.[1000].portfolio.[2].ticker.[TSLA]';
    expect(statePath).toBe(expectedStatePath);
  });

  it('should create wildcard ordered state path', () => {
    const state = {
      userId: {
        '[1000]': {
          portfolio: {
            '[2]': {
              ticker: {
                // -- Match any tickers' location in the state/store object
                '[TSLA]': {},
                '[GOOG]': {},
                '[INTL]': {},
                '[APPL]': {},
              },
            },
          },
        },
      },
    };
    const statePath = new OrderedStatePath()
      .append('userId', 1000)
      .append('portfolio', 2)
      .append('ticker', '*') // wildcard
      .toString();

    const expectedStatePath = 'userId.[1000].portfolio.[2].ticker';
    expect(statePath).toBe(expectedStatePath);
  });

  it('should clean up state path', () => {
    const state = {
      user_id: {
        '[1000]': {
          portfolio: {
            '[2]': {
              ticker: {
                // -- Match any tickers' location in the state/store object
                '[TSLA_R]': {},
                '[GOOG]': {},
                '[INTL]': {},
                '[APPL]': {},
              },
            },
          },
        },
      },
    };
    const statePath = new OrderedStatePath()
      .append('user.id', 1000)
      .append('.__portfolio__', 2)
      .append('ticker.....', 'TSLA.R')
      .toString();

    const expectedStatePath = 'user_id.[1000].portfolio.[2].ticker.[TSLA_R]';
    expect(statePath).toBe(expectedStatePath);
  });
});
