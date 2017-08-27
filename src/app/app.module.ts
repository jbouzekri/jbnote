import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NotesModule } from './notes/notes.module';
import { AppRoutingModule } from './app-routing.module';
import { ConfigStorageInterface } from './shared/config-storage.interface';
import { ConfigLocalStorageService } from './shared/config-local-storage.service';
import { LoggerService } from './shared/logger.service';
import { InstallModule } from './install/install.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    InstallModule,
    NotesModule
  ],
  providers: [
    // Global because shared between modules
    { provide: 'ConfigStorageInterface', useClass: ConfigLocalStorageService },
    LoggerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
