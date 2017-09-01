import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';

// Global rxjs features
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/first';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ConfigStorageInterface } from './shared/config-storage.interface';
import { ConfigLocalStorageService } from './shared/config-local-storage.service';
import { LoggerService } from './shared/logger.service';
import { IndexedDBGuard } from './shared/indexeddb-guard.service';
import { ErrorComponent } from './error/error.component';


@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent
  ],
  imports: [
    // Note : some modules are lazy loaded by loadChildren routes
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    // Global because shared between modules
    { provide: 'ConfigStorageInterface', useClass: ConfigLocalStorageService },
    LoggerService,
    IndexedDBGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(router: Router) {
    // Diagnostic only: inspect router configuration
    if (!environment.production) {
      console.log('Routes: ', JSON.stringify(router.config, undefined, 2));
    }
  }
}
