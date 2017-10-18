import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterStub, SHARED_PROVIDERS } from '../../testing';

import { InstallComponent } from './install.component';
import { SharedModule } from '../shared/shared.module';

@Component({selector: 'app-config-sync', template: `<p>Stub App Config Sync</p>`})
class AppConfigSyncStubComponent {}

@Component({selector: 'app-config-tutorial', template: `<p>Stub App Config Tutorial</p>`})
class AppConfigTutorialStubComponent {}

@Component({selector: 'app-enable-sync', template: `<p>Stub App Enable Sync</p>`})
class AppEnableSyncStubComponent {}

describe('InstallComponent', () => {
  let component: InstallComponent;
  let fixture: ComponentFixture<InstallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SharedModule, NoopAnimationsModule ],
      providers: [
        SHARED_PROVIDERS,
        { provide: Router, useClass: RouterStub },
      ],
      declarations: [
        InstallComponent,
        AppConfigSyncStubComponent, AppConfigTutorialStubComponent, AppEnableSyncStubComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
