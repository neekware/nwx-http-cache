import { Injectable, OnDestroy } from '@angular/core';
import {
  HttpEvent,
  HttpResponse,
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, of as observableOf, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  HttpCacheFetchPolicy,
  HTTP_CACHE_KEY,
  HTTP_CACHE_FETCH_POLICY,
  HTTP_CACHE_TTL,
  HttpCacheMetaData,
} from './http-cache.types';
import { HttpCacheService } from './http-cache.service';
import { isPolicyEnabled } from './http-cache.utils';
import { DefaultFetchPolicy } from './http-cache.defaults';

@Injectable()
export class HttpCacheInterceptor implements HttpInterceptor {
  constructor(private cache: HttpCacheService) {}

  /**
   * Extracts and returns the intercept meta data from request header
   * @param request {HttpRequest<any>} Intercepted request
   */
  private getMeta(req: HttpRequest<any>): HttpCacheMetaData {
    const policy = req.headers.get(HTTP_CACHE_FETCH_POLICY) || DefaultFetchPolicy;
    if (policy && !isPolicyEnabled(policy)) {
      throw Error(`Error: Invalid fetch policy (${policy})`);
    }

    return {
      policy: policy as HttpCacheFetchPolicy,
      key: req.headers.get(HTTP_CACHE_KEY),
      ttl: +(req.headers.get(HTTP_CACHE_TTL) || this.cache.options.httpCache.ttl),
    };
  }

  /**
   * Removes intercept meta data from http headers
   * @param request {HttpRequest<any>} Intercepted request
   */
  private cleanMeta(req: HttpRequest<any>) {
    [HTTP_CACHE_TTL, HTTP_CACHE_KEY, HTTP_CACHE_FETCH_POLICY].forEach(item =>
      req.headers.delete(item)
    );
  }

  /**
   * The logic to handle the cache intercept per meta data instructions
   * @param request {HttpRequest<any>} Intercepted request
   * @param next {HttpHandler} Handler for this intercept
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const meta = this.getMeta(req);
    if (meta && meta.key) {
      const cachedResponse = this.cache.get(meta.key);
      this.cleanMeta(req);
      switch (meta.policy) {
        case HttpCacheFetchPolicy.CacheFirst:
          if (cachedResponse) {
            return observableOf(<HttpEvent<any>>cachedResponse);
          }
          return this.playItForward(req, next, meta);

        case HttpCacheFetchPolicy.ChacheAndNetwork:
          if (cachedResponse) {
            this.playItForward(req, next, meta);
            return observableOf(<HttpEvent<any>>cachedResponse);
          }
          return this.playItForward(req, next, meta);

        case HttpCacheFetchPolicy.NetworkOnly:
          return this.playItForward(req, next, meta);

        case HttpCacheFetchPolicy.CacheOnly:
          if (cachedResponse) {
            return observableOf(<HttpEvent<any>>cachedResponse);
          }
          return throwError(new HttpErrorResponse({}));

        case HttpCacheFetchPolicy.CacheOff:
          return this.playItForward(req, next, meta);
      }
    }
    return this.playItForward(req, next);
  }

  playItForward(
    req: HttpRequest<any>,
    next: HttpHandler,
    meta?: HttpCacheMetaData
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          if (meta.key) {
            switch (meta.policy) {
              case HttpCacheFetchPolicy.CacheFirst:
              case HttpCacheFetchPolicy.ChacheAndNetwork:
              case HttpCacheFetchPolicy.NetworkFirst:
                this.cache.set(meta.key, meta.ttl, event);
                break;
              default:
                break;
            }
          }
        }
      })
    );
  }
}
