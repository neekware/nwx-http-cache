/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at http://neekware.com/license/MIT.html
 */

import { BehaviorSubject, Observable } from 'rxjs';
import { get as ldGet } from 'lodash';
import { StoreType, SetStateReducer } from './http-cache.types';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { isFunction } from './http-cache.utils';

export class CacheStore<T = StoreType> {
  private state$: BehaviorSubject<T>;

  /**
   * Initialize the store with the given initial state value
   * @param {T} The initial state of store
   */
  constructor(initialState: T) {
    this.state$ = new BehaviorSubject(initialState);
  }

  /**
   * Returns the current state as a stream
   * @returns {Observable<T>} The current state stream
   * Note: Emits the current state as the first item in the stream
   */
  getState(): Observable<T> {
    return this.state$.asObservable();
  }

  /**
   * Returns the current snapshot of the state
   * @returns {Object} Of type T
   */
  getStateSnapshot(): T {
    return this.state$.getValue();
  }

  /**
   * Moves the store to a new state by merging the given (or generated) partial state into
   * into the existing state (creating a new state object).
   * Note: https://github.com/Microsoft/TypeScript/issues/18823
   */
  setState(updater: SetStateReducer<T> | Partial<T>): void;
  setState(updater: any): void {
    const currentState = this.getStateSnapshot();
    const partialState = isFunction(updater) ? updater(currentState) : updater;
    const nextState = Object.assign({}, currentState, partialState);
    this.state$.next(nextState);
  }

  /**
   * Returns dot-notation state key (reference) as stream
   * Note: Emits the the current state key match as the first item in the stream
   */
  select<K extends keyof T>(key: K): Observable<T[K]> {
    const selected$ = this.state$.pipe(
      map((state: T) => ldGet(state, key)),
      distinctUntilChanged()
    );
    return selected$;
  }
}
