import { CommonTools } from './common.po';
import { browser } from 'protractor';

export class NotesPage extends CommonTools {
  async goToNewNoteForm() {
    this.getElByCss('a[ng-reflect-router-link="notes,new"]').click();
    await this.waitToBePresent('app-note-form form mat-form-field:nth-child(1) input', 15);
  }

  getNoteTitleInputSelector() {
    return 'app-note-form form mat-form-field:nth-child(1) input';
  }

  getNoteBodyTextareaSelector() {
    return 'app-note-form form mat-form-field:nth-child(2) textarea';
  }

  getNoteSubmitSelector() {
    return 'app-note-form form button';
  }

  async gotToPreviewFromNoteEdit() {
    this.getElByCss('app-note-form mat-tab-group mat-tab-header .mat-tab-label-container ' +
      '.mat-tab-list .mat-tab-labels div:nth-child(2)').click();
    await this.waitToBeVisible('app-note-form mat-tab-body mat-expansion-panel', 8);
  }

  async gotToNoteEditFromPreview() {
    this.getElByCss('app-note-form mat-tab-group mat-tab-header .mat-tab-label-container ' +
      '.mat-tab-list .mat-tab-labels div:nth-child(1)').click();
    await this.waitToBeVisible('app-note-form mat-tab-body mat-card form', 9);
  }

  async createNote(title: string, body: string, submit = true) {
    await this.goToNewNoteForm();
    this.fillField(this.getNoteTitleInputSelector(), title);
    this.fillField(this.getNoteBodyTextareaSelector(), body);
    if (submit) {
      this.getElByCss(this.getNoteSubmitSelector()).click();
      await this.waitToBePresent('app-note-list', 15);
    }
  }

  async createLoremIpsumNote() {
    await this.createNote(
      'Lorem ipsum',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eleifend venenatis vestibulum. Nulla dapibus ' +
      'ipsum a purus ultrices, at fermentum felis pharetra. Donec eleifend nec nisi ut iaculis. Suspendisse ' +
      'malesuada nunc sem, eget dictum elit pharetra sed. Suspendisse congue gravida magna a tempus. Ut dapibus leo ' +
      'ac porta vulputate. Aliquam non magna lectus. Donec sit amet lacus neque. Nunc a vehicula dolor. Vestibulum ' +
      'ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Etiam at quam ipsum. Etiam et ' +
      'elit molestie, blandit ante tempus, sodales diam. Donec id purus eget lectus dignissim finibus a viverra libero.'
    );
  }

  async createNumberedNote(num: number) {
    await this.createNote(
      `title ${num}`,
      `body ${num}`
    );
  }

  async waitForListToBePresent() {
    return await this.waitToBePresent('app-note-list mat-accordion mat-expansion-panel', 15);
  }
}
