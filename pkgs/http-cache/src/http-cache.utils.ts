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
 * @returns {string} A params interpolated string
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
