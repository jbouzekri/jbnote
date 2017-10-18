import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnableSyncComponent } from './enable-sync.component';
import { SharedModule } from '../../shared/shared.module';
import { SHARED_PROVIDERS } from '../../../testing/shared-stubs';

describe('EnableSyncComponent', () => {
  let component: EnableSyncComponent;
  let fixture: ComponentFixture<EnableSyncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SharedModule ],
      providers: [ SHARED_PROVIDERS ],
      declarations: [ EnableSyncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnableSyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
