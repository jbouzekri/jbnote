import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallConfigSyncComponent } from './install-config-sync.component';

describe('InstallConfigSyncComponent', () => {
  let component: InstallConfigSyncComponent;
  let fixture: ComponentFixture<InstallConfigSyncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstallConfigSyncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallConfigSyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
