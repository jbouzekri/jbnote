import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import {
  SHARED_PROVIDERS,
  RouterStub,
  ActivatedRouteStub,
  RouterLinkStubDirective
} from '../../../testing';
import { NoteFormComponent } from './note-form.component';
import { SharedModule } from '../../shared/shared.module';
import { NotesService } from '../services/notes.service';

class NoteServiceStub {
  get() {
    return Observable.of({id: null, title: 'Post title', body: 'Post body', createdAt: null, updatedAt: null});
  }
}

describe('NoteFormComponent', () => {
  let component: NoteFormComponent;
  let fixture: ComponentFixture<NoteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SharedModule, NoopAnimationsModule ],
      providers: [
        SHARED_PROVIDERS,
        { provide: NotesService, useClass: NoteServiceStub },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub({'id': '1'}) }
      ],
      declarations: [
        NoteFormComponent,
        RouterLinkStubDirective
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
