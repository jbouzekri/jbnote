import { NotesPage } from './notes.po';
import { browser } from 'protractor';

import { Note } from '../src/app/notes/models/note.model';
import { FirebaseClient } from './firebase.po';

describe('jbnote Notes with Sync', () => {
  let page: NotesPage;
  let client: FirebaseClient;

  beforeEach(async () => {
    browser.waitForAngularEnabled(false);
    page = new NotesPage();
    client = new FirebaseClient();
    await client.isReady();
  });

  afterEach(async () => {
    browser.waitForAngularEnabled(true);
    await client.destroy();
    browser.restart();
  });

  it('synchronizes with firebase on note creation', async (done) => {
    const now = (new Date()).getTime();
    await page.enableFirebaseSync();
    await page.createNumberedNote(0);
    await page.createNumberedNote(1);
    await page.createNumberedNote(2);
    await page.waitForListToBePresent();

    setTimeout(async function() {
      await client.validate(function(notes: {[key: string]: Note}) {
        const remoteKeys = Object.keys(notes);
        expect<any>(Object.keys(notes).length).toBe(3);
        expect<any>(notes[remoteKeys[0]].title).toBe('title 0');
        expect<any>(notes[remoteKeys[0]].body).toBe('body 0');
        expect<any>(notes[remoteKeys[0]].createdAt).toBeGreaterThan(now);
        expect<any>(notes[remoteKeys[0]].updatedAt).toBeGreaterThan(now);
        expect<any>('deletedAt' in notes[remoteKeys[0]]).toBe(false);

        expect<any>(notes[remoteKeys[1]].title).toBe('title 1');
        expect<any>(notes[remoteKeys[1]].body).toBe('body 1');
        expect<any>(notes[remoteKeys[1]].createdAt).toBeGreaterThan(now);
        expect<any>(notes[remoteKeys[1]].updatedAt).toBeGreaterThan(now);
        expect<any>('deletedAt' in notes[remoteKeys[1]]).toBe(false);

        expect<any>(notes[remoteKeys[2]].title).toBe('title 2');
        expect<any>(notes[remoteKeys[2]].body).toBe('body 2');
        expect<any>(notes[remoteKeys[2]].createdAt).toBeGreaterThan(now);
        expect<any>(notes[remoteKeys[2]].updatedAt).toBeGreaterThan(now);
        expect<any>('deletedAt' in notes[remoteKeys[2]]).toBe(false);
      });
      done();
    }, 4000);
  });

  it('synchronizes with firebase on note edit', async (done) => {
    const now = (new Date()).getTime();
    await page.enableFirebaseSync();
    await page.createNumberedNote(4);
    await page.createNumberedNote(5);
    await page.createNumberedNote(6);
    await page.waitForListToBePresent();

    const beforeUpdate = (new Date()).getTime();

    const noteSelector = 'mat-accordion mat-expansion-panel:nth-child(2)';

    await page.waitToBeVisible(`${noteSelector} mat-icon`, 10);
    page.getElByCss(`${noteSelector} mat-icon`).click();

    await page.waitToBeVisible('.cdk-overlay-container .mat-menu-panel .mat-menu-content button:nth-child(2)', 10);
    page.getElByCss('.cdk-overlay-container .mat-menu-panel .mat-menu-content button:nth-child(2)').click();

    await page.waitToBeVisible('app-note-form', 12);

    page.fillField(page.getNoteTitleInputSelector(), 'title edited');
    page.fillField(page.getNoteBodyTextareaSelector(), 'body edited');
    await page.waitForElementToBeClickable(page.getNoteSubmitSelector(), 5);
    page.getElByCss(page.getNoteSubmitSelector()).click();

    await page.waitForListToBePresent();

    setTimeout(async function() {
      await client.validate(function(notes: {[key: string]: Note}) {
        const remoteKeys = Object.keys(notes);
        expect<any>(Object.keys(notes).length).toBe(3);
        expect<any>(notes[remoteKeys[0]].title).toBe('title 4');
        expect<any>(notes[remoteKeys[0]].body).toBe('body 4');
        expect<any>(notes[remoteKeys[0]].createdAt).toBeGreaterThan(now);
        expect<any>(notes[remoteKeys[0]].createdAt).toBeLessThan(beforeUpdate);
        expect<any>(notes[remoteKeys[0]].updatedAt).toBeGreaterThan(now);
        expect<any>('deletedAt' in notes[remoteKeys[0]]).toBe(false);

        expect<any>(notes[remoteKeys[1]].title).toBe('title edited');
        expect<any>(notes[remoteKeys[1]].body).toBe('body edited');
        expect<any>(notes[remoteKeys[1]].createdAt).toBeGreaterThan(now);
        expect<any>(notes[remoteKeys[1]].createdAt).toBeLessThan(beforeUpdate);
        expect<any>(notes[remoteKeys[1]].updatedAt).toBeGreaterThan(beforeUpdate);
        expect<any>('deletedAt' in notes[remoteKeys[1]]).toBe(false);

        expect<any>(notes[remoteKeys[2]].title).toBe('title 6');
        expect<any>(notes[remoteKeys[2]].body).toBe('body 6');
        expect<any>(notes[remoteKeys[2]].createdAt).toBeGreaterThan(now);
        expect<any>(notes[remoteKeys[2]].createdAt).toBeLessThan(beforeUpdate);
        expect<any>(notes[remoteKeys[2]].updatedAt).toBeGreaterThan(now);
        expect<any>('deletedAt' in notes[remoteKeys[2]]).toBe(false);
      });
      done();
    }, 4000);
  });

  it('synchronizes with firebase on note removal', async (done) => {
    const now = (new Date()).getTime();
    await page.enableFirebaseSync();
    await page.createNumberedNote(7);
    await page.createNumberedNote(8);
    await page.createNumberedNote(9);
    await page.waitForListToBePresent();

    const beforeRemoval = (new Date()).getTime();

    const noteSelector = 'mat-accordion mat-expansion-panel:nth-child(2)';

    await page.waitToBeVisible(`${noteSelector} mat-icon`, 10);
    page.getElByCss(`${noteSelector} mat-icon`).click();

    await page.waitToBeVisible('.cdk-overlay-container .mat-menu-panel .mat-menu-content button:nth-child(3)', 10);
    page.getElByCss('.cdk-overlay-container .mat-menu-panel .mat-menu-content button:nth-child(3)').click();

    browser.switchTo().alert().accept();

    await page.waitToBeAbsent('mat-accordion mat-expansion-panel:nth-child(3)', 7);

    setTimeout(async function() {
      await client.validate(function(notes: {[key: string]: Note}) {
        const remoteKeys = Object.keys(notes);
        expect<any>(Object.keys(notes).length).toBe(3);
        expect<any>(notes[remoteKeys[0]].title).toBe('title 7');
        expect<any>(notes[remoteKeys[0]].body).toBe('body 7');
        expect<any>(notes[remoteKeys[0]].createdAt).toBeGreaterThan(now);
        expect<any>(notes[remoteKeys[0]].updatedAt).toBeGreaterThan(now);
        expect<any>('deletedAt' in notes[remoteKeys[0]]).toBe(false);

        expect<any>(notes[remoteKeys[1]].title).toBe('title 8');
        expect<any>(notes[remoteKeys[1]].body).toBe('body 8');
        expect<any>(notes[remoteKeys[1]].createdAt).toBeGreaterThan(now);
        expect<any>(notes[remoteKeys[1]].updatedAt).toBeGreaterThan(now);
        expect<any>(notes[remoteKeys[1]].deletedAt).toBeGreaterThan(beforeRemoval);

        expect<any>(notes[remoteKeys[2]].title).toBe('title 9');
        expect<any>(notes[remoteKeys[2]].body).toBe('body 9');
        expect<any>(notes[remoteKeys[2]].createdAt).toBeGreaterThan(now);
        expect<any>(notes[remoteKeys[2]].updatedAt).toBeGreaterThan(now);
        expect<any>('deletedAt' in notes[remoteKeys[2]]).toBe(false);
      });
      done();
    }, 4000);
  });

  it('synchronizes with firebase on startup', async (done) => {
    await client.createNote('first');
    await client.createNote('second');

    await page.enableFirebaseSync();

    setTimeout(async function() {
      page.fillField('#search-box', 'title');
      await page.waitToBePresent('mat-accordion mat-expansion-panel:nth-child(2)', 10);
      expect<any>(page.getAllElByCss('mat-expansion-panel').count()).toBe(2);
      done();
    }, 4000);
  });
});

