import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterOutletStubComponent } from '../../testing';
import { NotesComponent } from './notes.component';
import { SHARED_PROVIDERS } from '../../testing/shared-stubs';
import { NotesService } from './services/notes.service';

class NoteServiceStub {
  init() {
    return Promise.resolve();
  }
}

describe('NotesComponent', () => {
  let component: NotesComponent;
  let fixture: ComponentFixture<NotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        SHARED_PROVIDERS,
        { provide: NotesService, useClass: NoteServiceStub }
      ],
      declarations: [
        NotesComponent,
        RouterOutletStubComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
