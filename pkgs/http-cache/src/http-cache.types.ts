/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at http://neekware.com/license/MIT.html
 */

/**
 * HttpCache config declaration
 */
export class HttpCacheCfg {
  // disable http cache globally
  disabled: boolean;
  // estimate expiry time of http cache (in seconds)
  ttl: number;
}

/**
 * Unique Meta Data for http request
 */
export interface HttpCacheUniqueMeta {
  [id: string]: string | number;
}

/**
 * Http Fetch Policy
 */
export type HttpCacheFetchPolicy =
  // cache-off: This fetch policy will never return your initial data from the cache. Instead it will
  // always make a network request. Unlike the network-only policy, it will not write any data to
  // the cache after the query completes.  This fetch policy strives to keep client and server state n'sync
  // at all time.  Usage: JWT token request.
  | 'cache-off'

  // cache-only: This fetch policy will never execute a network query. Instead it will always
  // try reading from the cache. If the query data does not exist in the cache then an error
  // will be thrown. This fetch policy allows for local client cache interaction without making
  // any network requests. This fetch policy strives to keep your app fast at the cost of possible
  // inconsistency with the server. Usage: Loading the app while in Airplane mode
  | 'cache-only'

  // cache-first: This fetch policy always tries reading data from the cache first. If the
  // requested data is found in cache then it will be returned. It will only fetch from the network
  // if a cached result is not available. This fetch policy strives to speed up the rendering of
  // components, by minimizing the number of network requests. Usage: Defer http responses of a long list
  | 'cache-first'

  // network-only: This fetch policy will never return the initial data from the cache.
  // Instead it will always executes a network request to the server, then saves a copy of it in cache.
  // This fetch policy strives to optimize for data consistency with the server, but at the cost of an
  // fresh response to the user when one is available. Usage: User authentication request
  | 'network-only'

  // network-first: This fetch policy will make a network request,
  // Instead it will always executes a network request to the server. This fetch policy
  // strives to optimize for data consistency with the server, but at the cost of an instant
  // response to the user when one is available.
  | 'network-first'

  // cache-and-network: This fetch policy will first try to read data from the cache.
  // If the requested data is found in cache then it will be returned. However, regardless
  // the cache data, this fetchPolicy will always execute a network query.
  // This fetch policy strives to optimize for a quick response while also trying to keep
  // cached data consistent with the server data at the cost of extra network requests.
  | 'cache-and-network';

export const HTTP_CACHE_KEY = '__HTTP_CACHE_KEY__';
export const HTTP_CACHE_FETCH_POLICY = '__HTTP_CACHE_FETCH_POLICY__';
export const HTTP_CACHE_TTL = '__HTTP_CACHE_TTL__';

/**
 * State Reducer that gives the caller the option of defining the new state partial using a callback by
 * providing the current state snapshot.
 */
export type SetStateReducer<T> = (currentState: T) => Partial<T>;

/**
 * Store Type - Object
 */
export interface StoreType {
  [key: string]: any;
}

/**
 * Options for interpolation
 */
export interface InterpolationOptions {
  singleSpace: boolean;
  trim: boolean;
}
