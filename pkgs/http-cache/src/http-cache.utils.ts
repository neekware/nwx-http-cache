/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at http://neekware.com/license/MIT.html
 */

import { merge as ldMerge } from 'lodash';
import { InterpolationOptions } from './http-cache.types';
import { DefaultInterpolationOptions } from './http-cache.defaults';

/**
 * Checks if an object is a function
 * @param input {any} An input of any type
 */
export function isFunction(input: any): boolean {
  return typeof input === 'function' || input instanceof Function || false;
}

/**
 * Interpolation of template with args
 */
const template = (tpl, args) => tpl.replace(/\${(\w+)}/g, (_, v) => args[v]);

/**
 * Interpolation of template with args with params
 * @param inputString {string} An input of type string
 * @param params {Object} A key:value object of parameters
 * @param options {InterpolationOptions} Options for Interpolation
 * @returns A params interpolated string
 */
export const interpolate = (
  inputString: string,
  params: { [id: string]: string | number },
  options?: InterpolationOptions
): string => {
  options = ldMerge(DefaultInterpolationOptions, options || {});
  let output = template(inputString, params);
  if (options.singleSpace) {
    output = output.replace(/\s+/g, ' ');
  }
  if (options.trim) {
    output = output.trim();
  }
  return output;
};

/**
 * Class to create ordered path to our internal state/store
 */
export class OrderedStatePath {
  private map = new Map<string | number, string | number>();

  /**
   * Cleans up an input string consumable by objects as key or value
   * @param input {string} A key or a value
   */
  private cleanString(input: string): string {
    return `${input}`
      .replace(/\s+/gm, '') // convert to single line
      .replace(/\./g, '_') // replace . with _
      .replace(/_+/g, '_') // replace multiple _ with single _
      .replace(/^[_]+|[_]+$/g, '') // remove _ from start & end
      .trim();
  }

  /**
   * Add a key,value pair to internal map
   * @param key {string|number} Key of a tuple
   * @param value {string|number} Value of a tuple
   * @returns A map of key,value pairs
   * Note: value = '*' means catch all
   */
  add(key: string | number, value: string | number) {
    key = this.cleanString(`${key}`);
    if (!key || key.length < 1) {
      throw Error('Error: empty key is not allowed!');
    }

    value = this.cleanString(`${value}`);
    if (!value || value.length < 1) {
      throw Error('Error: empty value is not allowed!');
    }

    this.map = this.map.set(key, value);
    return this;
  }

  /**
   * Converts the internal key,value map to a dot-separated string
   * @returns  A dot-separated string (a path into the state object in the store)
   */
  toString() {
    const hierarchy = [];
    this.map.forEach((value, key, map) => {
      if (value === '*') {
        hierarchy.push(key);
      } else {
        hierarchy.push(`${key}.[${value}]`);
      }
    });
    return hierarchy.join('.').replace(/\s+/g, '');
  }
}
