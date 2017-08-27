import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallEnableSyncComponent } from './install-enable-sync.component';

describe('InstallEnableSyncComponent', () => {
  let component: InstallEnableSyncComponent;
  let fixture: ComponentFixture<InstallEnableSyncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstallEnableSyncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallEnableSyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
