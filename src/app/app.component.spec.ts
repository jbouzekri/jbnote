import { TestBed, async } from '@angular/core/testing';
import { Component } from '@angular/core';
import {} from 'jasmine';

import { RouterOutletStubComponent } from '../testing';

import { AppComponent } from './app.component';

@Component({selector: 'app-header', template: `<h1>Stub App Header</h1>`})
class AppHeaderStubComponent {}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        AppHeaderStubComponent,
        RouterOutletStubComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
