/**
 * Root module
 *
 * @module app/app.module
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';

// Global rxjs features
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/last';
import 'rxjs/add/operator/filter';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ConfigStorageService } from './shared/config-storage.service';
import { ConfigLocalStorageService } from './shared/config-local-storage.service';
import { LoggerService } from './shared/logger.service';
import { IndexedDBGuard } from './shared/indexeddb-guard.service';
import { ErrorComponent } from './error/error.component';
import { SharedModule } from './shared/shared.module';
import { HeaderComponent } from './header/header.component';


@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    HeaderComponent
  ],
  imports: [
    // Note : some modules are lazy loaded by loadChildren routes
    // see `app-routing.module.ts` for more information
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AppRoutingModule
  ],
  providers: [
    // Global because shared between modules
    { provide: ConfigStorageService, useClass: ConfigLocalStorageService },
    LoggerService,
    IndexedDBGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(router: Router) {
    if (environment.isDetail) {
      // Diagnostic only: inspect router configuration
      console.log('Routes: ', JSON.stringify(router.config, undefined, 2));
    }
  }
}
