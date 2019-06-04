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

export interface Role {
  userId: string;
  isAdmin: boolean;
  isStaff: boolean;
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
    this.userCacheKey = new OrderedStatePath()
      .append('userId', 1)
      .append('profileId', '1234')
      .append('ticker', 'TSLA')
      .toString();

    this.cacheService.store.select<User>(this.userCacheKey).subscribe({
      next: user => {
        console.log('via Select', user);
      },
    });

    this.roleCacheKey = new OrderedStatePath()
      .append('userId', 1)
      .append('roleId', 1)
      .append('ticker', 'TSLA')
      .toString();

    this.cacheService.store.select<Role>(this.roleCacheKey).subscribe({
      next: role => {
        console.log('via Select', role);
      },
    });
  }

  makeUserRequest() {
    const cacheBuster = new Date().getMilliseconds();
    const url = `/assets/data/users.json?cacheBust=${cacheBuster}`;
    const httpHeaders = addMetaToHttpHeaders({
      policy: HttpCacheFetchPolicy.CacheFirst,
      key: this.userCacheKey,
      ttl: 5,
    });

    this.http.get<User>(url, { headers: httpHeaders }).subscribe(user => {
      console.log('via Http', user);
    });
  }

  makeRoleRequest() {
    const cacheBuster = new Date().getMilliseconds();
    const url = `/assets/data/roles.json?cacheBust=${cacheBuster}`;
    const httpHeaders = addMetaToHttpHeaders({
      policy: HttpCacheFetchPolicy.CacheFirst,
      key: this.roleCacheKey,
      ttl: 5,
    });

    this.http.get<Role>(url, { headers: httpHeaders }).subscribe(role => {
      console.log('via Http', role);
    });
  }
}
