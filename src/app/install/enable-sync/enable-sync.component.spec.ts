import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnableSyncComponent } from './enable-sync.component';

describe('EnableSyncComponent', () => {
  let component: EnableSyncComponent;
  let fixture: ComponentFixture<EnableSyncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
