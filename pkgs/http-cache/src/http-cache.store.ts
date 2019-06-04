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
   * @param initialState The initial state of store
   */
  constructor(initialState: T) {
    this.state$ = new BehaviorSubject<T>(initialState);
  }

  /**
   * Returns the current state as a stream
   * @returns The current state stream
   * Note: Emits the current state as the first item in the stream
   */
  getState(): Observable<T> {
    return this.state$.asObservable();
  }

  /**
   * Returns the current snapshot of the state
   * @returns Object of type T
   */
  getStateSnapshot(): T {
    return this.state$.getValue();
  }

  /**
   * Moves the store to a new state by merging the given (or generated) partial state
   * into the existing state (creating a new state object).
   * @param updater Partial data or function to update state
   * Note: https://github.com/Microsoft/TypeScript/issues/18823
   */
  setState(updater: SetStateReducer<T> | Partial<T>): void;
  setState(updater: any): void {
    const currentState = this.getStateSnapshot();
    const partialState = isFunction(updater) ? updater(currentState) : updater;
    const nextState = Object.assign({}, currentState, partialState);
    this.state$.next(nextState);
    console.log(this.getStateSnapshot());
  }

  /**
   * Returns dot-notation state key (reference) as stream
   * @param key Key to section of state
   * Note: Emits the the current state key match as the first item in the stream
   */
  select<K>(key: string): Observable<K> {
    const selected$ = this.state$.pipe(
      map(state => ldGet(state, key) as K),
      distinctUntilChanged()
    );
    return selected$;
  }
}
