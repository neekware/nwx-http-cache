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
  HTTP_INTRECEPT_CACHE_KEY,
  HTTP_INTRECEPT_FETCH_POLICY,
} from './http-cache.types';
import { HttpCacheService } from './http-cache.service';

@Injectable()
export class HttpCacheInterceptor implements HttpInterceptor {
  constructor(private cache: HttpCacheService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const cacheKey = req.headers.get(HTTP_INTRECEPT_CACHE_KEY);
    if (cacheKey) {
      const cachedResponse = this.cache.get(cacheKey);
      const fetchPolicy =
        req.headers.get(HTTP_INTRECEPT_FETCH_POLICY) || HttpCacheFetchPolicy.CacheFirst;
      switch (fetchPolicy) {
        case HttpCacheFetchPolicy.CacheFirst:
          if (cachedResponse) {
            req.headers.delete(HTTP_INTRECEPT_CACHE_KEY);
            req.headers.delete(HTTP_INTRECEPT_FETCH_POLICY);
            return observableOf(<HttpEvent<any>>cachedResponse);
          }
          return this.playItForward(req, next, cacheKey, fetchPolicy);

        case HttpCacheFetchPolicy.CacheAndNetwork:
          if (cachedResponse) {
            this.playItForward(req, next, cacheKey, fetchPolicy);
            return observableOf(<HttpEvent<any>>cachedResponse);
          }
          return this.playItForward(req, next, cacheKey, fetchPolicy);

        case HttpCacheFetchPolicy.NetworkOnly:
          return this.playItForward(req, next, cacheKey, fetchPolicy);

        case HttpCacheFetchPolicy.CacheOnly:
          req.headers.delete(HTTP_INTRECEPT_CACHE_KEY);
          req.headers.delete(HTTP_INTRECEPT_FETCH_POLICY);
          if (cachedResponse) {
            return observableOf(<HttpEvent<any>>cachedResponse);
          }
          return throwError(new HttpErrorResponse({}));

        case HttpCacheFetchPolicy.CacheOff:
          return this.playItForward(req, next, cacheKey, fetchPolicy);
      }
    }
    return this.playItForward(req, next);
  }

  playItForward(
    req: HttpRequest<any>,
    next: HttpHandler,
    cacheKey?: string,
    fetchPolicy?: HttpCacheFetchPolicy
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          if (cacheKey) {
            switch (fetchPolicy) {
              case HttpCacheFetchPolicy.CacheFirst:
              case HttpCacheFetchPolicy.CacheAndNetwork:
              case HttpCacheFetchPolicy.NetworkFirst:
                this.cache.set(cacheKey, event);
                break;
              default:
                break;
            }
            req.headers.delete(HTTP_INTRECEPT_CACHE_KEY);
            req.headers.delete(HTTP_INTRECEPT_FETCH_POLICY);
          }
        }
      })
    );
  }
}
