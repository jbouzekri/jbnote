import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { NoteListComponent } from './note-list.component';
import { NotesService } from '../services/notes.service';
import { SharedModule } from '../../shared/shared.module';
import { SHARED_PROVIDERS, RouterLinkStubDirective } from '../../../testing';

class NoteServiceStub {
  init() {
    return Promise.resolve();
  }
}

describe('NoteListComponent', () => {
  let component: NoteListComponent;
  let fixture: ComponentFixture<NoteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SharedModule, NoopAnimationsModule ],
      providers: [
        SHARED_PROVIDERS,
        { provide: NotesService, useClass: NoteServiceStub }
      ],
      declarations: [
        NoteListComponent,
        RouterLinkStubDirective
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
