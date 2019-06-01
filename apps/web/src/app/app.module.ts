import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { CfgModule } from '@nwx/cfg';
import { LogModule } from '@nwx/logger';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import { HttpCacheModule, HttpCacheInterceptor } from 'pkgs/http-cache';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CfgModule.forRoot(environment),
    LogModule,
    HttpCacheModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCacheInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
