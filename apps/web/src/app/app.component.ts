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
  cacheKey: string;

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
    this.cacheKey = new OrderedStatePath()
      .append('userId', 1)
      .append('profileId', '1234')
      .append('ticker', 'TSLA')
      .toString();

    this.cacheService.store.select<User>(this.cacheKey).subscribe({
      next: user => {
        console.log('via Select', user);
      },
    });
  }

  makeRequest() {
    const cacheBuster = new Date().getMilliseconds();
    const url = `/assets/data/users.json?cacheBust=${cacheBuster}`;
    const httpHeaders = addMetaToHttpHeaders({
      policy: HttpCacheFetchPolicy.CacheFirst,
      key: this.cacheKey,
      ttl: 5,
    });

    this.http.get<User>(url, { headers: httpHeaders }).subscribe(user => {
      console.log('via Http', user);
    });
  }
}
