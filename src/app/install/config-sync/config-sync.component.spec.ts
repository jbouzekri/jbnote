import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ConfigSyncComponent } from './config-sync.component';
import { SharedModule } from '../../shared/shared.module';
import { SHARED_PROVIDERS } from '../../../testing/shared-stubs';

describe('ConfigSyncComponent', () => {
  let component: ConfigSyncComponent;
  let fixture: ComponentFixture<ConfigSyncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SharedModule, NoopAnimationsModule ],
      providers: [ SHARED_PROVIDERS ],
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
