import { Component, OnInit } from '@angular/core';

import { CfgService, DefaultCfg } from '@nwx/cfg';
import { LogService } from '@nwx/logger';

import { OrderedStatePath, HttpCacheService } from 'pkgs/http-cache';
import { HttpClient } from '@angular/common/http';
import { HttpCacheFetchPolicy } from 'pkgs/http-cache/src/http-cache.types';
import { addMetaToHttpHeaders } from 'pkgs/http-cache/src/http-cache.utils';

export interface User {
  id: string;
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Neekware';
  options = {};
  userCacheKey: string;
  roleCacheKey: string;

  constructor(
    private http: HttpClient,
    private cfg: CfgService,
    private log: LogService,
    private cacheService: HttpCacheService
  ) {
    this.title = this.cfg.options.appName;
    this.log.info('AppComponent loaded ...');
  }

  ngOnInit() {
    this.cacheService.store
      .select<User>(new OrderedStatePath().append('user', 1).toString())
      .subscribe({
        next: user => {
          this.log.debug('User via Select', user);
        },
      });

    this.cacheService.store
      .select<User>(new OrderedStatePath().append('user', 2).toString())
      .subscribe({
        next: user => {
          this.log.debug('User via Select', user);
        },
      });

    this.cacheService.store
      .select(new OrderedStatePath().append('portfolio', 1).toString())
      .subscribe({
        next: user => {
          this.log.debug('Portfolio via Select', user);
        },
      });

    this.cacheService.store
      .select(new OrderedStatePath().append('portfolio', 2).toString())
      .subscribe({
        next: user => {
          this.log.debug('Portfolio via Select', user);
        },
      });
  }

  makeUserRequest(id: string) {
    const cacheKey = new OrderedStatePath().append('user', id).toString();
    const cacheBuster = new Date().getMilliseconds();
    const url = `/assets/data/user${id}.json?cacheBust=${cacheBuster}`;
    const httpHeaders = addMetaToHttpHeaders({
      policy: HttpCacheFetchPolicy.CacheFirst,
      key: cacheKey,
      ttl: 5,
    });

    this.http.get<User>(url, { headers: httpHeaders }).subscribe(user => {
      this.log.debug('User via Http', user);
    });
  }

  makePortfolioRequest(id: string) {
    const cacheKey = new OrderedStatePath().append('portfolio', id).toString();
    const cacheBuster = new Date().getMilliseconds();
    const url = `/assets/data/portfolio${id}.json?cacheBust=${cacheBuster}`;
    const httpHeaders = addMetaToHttpHeaders({
      policy: HttpCacheFetchPolicy.CacheFirst,
      key: cacheKey,
      ttl: 5,
    });

    this.http.get<any>(url, { headers: httpHeaders }).subscribe(portfolio => {
      this.log.debug('Portfolio via Http', portfolio);
    });
  }
}
