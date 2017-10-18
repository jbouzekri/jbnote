import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigTutorialComponent } from './config-tutorial.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from '../../shared/shared.module';

describe('ConfigTutorialComponent', () => {
  let component: ConfigTutorialComponent;
  let fixture: ComponentFixture<ConfigTutorialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SharedModule, NoopAnimationsModule ],
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
