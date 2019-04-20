import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { CfgModule } from '@nwx/cfg';
import { LogModule } from '@nwx/logger';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import { HttpCacheModule } from 'pkgs/http-cache';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, CfgModule.forRoot(environment), LogModule, HttpCacheModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
