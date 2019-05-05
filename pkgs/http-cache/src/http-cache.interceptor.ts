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
} from './http-cache.types';
import { HttpCacheService } from './http-cache.service';

@Injectable()
export class HttpCacheInterceptor implements HttpInterceptor {
  constructor(private cache: HttpCacheService) {}

  /**
   * Returns a fetch policy for this request
   * @param request {HttpRequest<any>} Intercepted request
   * @param defaultPolicy {HttpCacheFetchPolicy} Fallback default policy
   */
  private getRequestFetchPolicy(
    request: HttpRequest<any>,
    defaultPolicy?: HttpCacheFetchPolicy
  ): HttpCacheFetchPolicy {
    let policy = request.headers.get(HTTP_CACHE_FETCH_POLICY);
    if (!policy && defaultPolicy) {
      policy = defaultPolicy;
    }
    return policy as HttpCacheFetchPolicy;
  }

  /**
   * Returns the cache key from request
   * @param request {HttpRequest<any>} Intercepted request
   */
  private getRequestCacheKey(request: HttpRequest<any>): string {
    const cacheKey = request.headers.get(HTTP_CACHE_KEY);
    return cacheKey;
  }

  /**
   * Returns the cache TTL from request
   * @param request {HttpRequest<any>} Intercepted request
   */
  private getRequestCacheTtl(request: HttpRequest<any>): number {
    return +request.headers.get(HTTP_CACHE_TTL) || +this.cache.options.httpCache.ttl;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const cacheKey = this.getRequestCacheKey(req);
    if (cacheKey) {
      const ttl = this.getRequestCacheTtl(req);
      const cachedResponse = this.cache.get(cacheKey);
      const fetchPolicy = this.getRequestFetchPolicy(req, 'cache-first');
      switch (fetchPolicy) {
        case 'cache-first':
          if (cachedResponse) {
            req.headers.delete(HTTP_CACHE_KEY);
            req.headers.delete(HTTP_CACHE_FETCH_POLICY);
            return observableOf(<HttpEvent<any>>cachedResponse);
          }
          return this.playItForward(req, next, cacheKey, fetchPolicy);

        case 'cache-and-network':
          if (cachedResponse) {
            this.playItForward(req, next, cacheKey, fetchPolicy);
            return observableOf(<HttpEvent<any>>cachedResponse);
          }
          return this.playItForward(req, next, cacheKey, fetchPolicy);

        case 'network-only':
          return this.playItForward(req, next, cacheKey, fetchPolicy);

        case 'cache-only':
          req.headers.delete(HTTP_CACHE_KEY);
          req.headers.delete(HTTP_CACHE_FETCH_POLICY);
          if (cachedResponse) {
            return observableOf(<HttpEvent<any>>cachedResponse);
          }
          return throwError(new HttpErrorResponse({}));

        case 'cache-off':
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
              case 'cache-first':
              case 'cache-and-network':
              case 'network-first':
                this.cache.set(cacheKey, event);
                break;
              default:
                break;
            }
            req.headers.delete(HTTP_CACHE_KEY);
            req.headers.delete(HTTP_CACHE_FETCH_POLICY);
          }
        }
      })
    );
  }
}
