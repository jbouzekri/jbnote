import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigTutorialComponent } from './config-tutorial.component';

describe('ConfigTutorialComponent', () => {
  let component: ConfigTutorialComponent;
  let fixture: ComponentFixture<ConfigTutorialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigTutorialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigTutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
