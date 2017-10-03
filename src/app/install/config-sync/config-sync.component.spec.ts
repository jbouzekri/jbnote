import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigSyncComponent } from './config-sync.component';

describe('ConfigSyncComponent', () => {
  let component: ConfigSyncComponent;
  let fixture: ComponentFixture<ConfigSyncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigSyncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigSyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
