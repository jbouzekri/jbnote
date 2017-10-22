import { CommonTools } from './common.po';
import { browser } from 'protractor';

export class NotesPage extends CommonTools {
  async createNote(title: string, body: string) {
    this.getElByCss('a[ng-reflect-router-link="notes,new"]').click();
    await this.waitToBePresent('app-note-form form mat-form-field:nth-child(1) input', 15);
    this.fillField('app-note-form form mat-form-field:nth-child(1) input', title);
    this.fillField('app-note-form form mat-form-field:nth-child(2) textarea', body);
    this.getElByCss('app-note-form form button').click();
    await this.waitToBePresent('app-note-list', 15);
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
}
