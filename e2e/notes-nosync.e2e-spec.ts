import { NotesPage } from './notes.po';
import { browser } from 'protractor';
import { hasClass } from './common.po';

describe('jbnote Notes No Sync', () => {
  let page: NotesPage;

  beforeEach(() => {
    browser.waitForAngularEnabled(false);
    page = new NotesPage();
  });

  afterEach(function() {
    browser.waitForAngularEnabled(true);
    page.restart();
  });

  it('should show no notes in list on startup', async (done) => {
    await page.disableFirebaseSync();

    expect<any>(page.getCurrentUrl(false)).toEqual('/notes');
    expect<any>(page.getSyncStatusIcon()).toEqual('sync_disabled');

    expect<any>(page.getElByCss('app-note-list div p').getText()).toBe('No note found');

    done();
  });

  it('adds a note and shows it in list', async (done) => {
    await page.disableFirebaseSync();
    await page.createLoremIpsumNote();
    await page.waitForListToBePresent();

    expect<any>(page.getAllElByCss('mat-expansion-panel').count()).toBe(1);

    done();
  });

  it('shows the last 15 notes in the list', async (done) => {
    await page.disableFirebaseSync();
    for (let i = 0; i < 20; i++) {
      await page.createNumberedNote(i);
    }
    await page.waitForListToBePresent();

    expect<any>(page.getAllElByCss('mat-expansion-panel').count()).toBe(15);

    done();
  });

  it('should filter list on search', async (done) => {
    await page.disableFirebaseSync();
    await page.createLoremIpsumNote();
    for (let i = 0; i < 5; i++) {
      await page.createNumberedNote(i);
    }
    await page.waitForListToBePresent();

    expect<any>(page.getAllElByCss('mat-expansion-panel').count()).toBe(6);

    page.fillField('#search-box', 'Lorem');

    await page.waitToBeAbsent('app-note-list mat-accordion mat-expansion-panel:nth-child(2)', 10);

    expect<any>(page.getAllElByCss('mat-expansion-panel').count()).toBe(1);

    done();
  });

  it('should expand note on click on item', async (done) => {
    await page.disableFirebaseSync();
    await page.createNumberedNote(0);
    await page.createLoremIpsumNote(); // Test expands this one
    await page.createNumberedNote(1);
    await page.waitForListToBePresent();

    expect<any>(page.getAllElByCss('mat-expansion-panel').count()).toBe(3);

    const noteSelector = 'mat-accordion mat-expansion-panel:nth-child(2)';

    page.getElByCss(noteSelector).click();

    await page.waitToBeVisible(`${noteSelector} .mat-expansion-panel-content`, 10);

    expect<any>(hasClass(page.getElByCss(noteSelector), 'mat-expanded')).toBe(true);

    const noteBody = page.getElByCss(`${noteSelector} .mat-expansion-panel-body markdown-to-html`).getText();
    expect<any>(noteBody).toContain('Lorem ipsum dolor sit amet');

    done();
  });

  it('should expand note on click on view menu', async (done) => {
    await page.disableFirebaseSync();
    await page.createNumberedNote(0);
    await page.createLoremIpsumNote(); // Test expands this one
    await page.createNumberedNote(1);
    await page.waitForListToBePresent();

    expect<any>(page.getAllElByCss('mat-expansion-panel').count()).toBe(3);

    const noteSelector = 'mat-accordion mat-expansion-panel:nth-child(2)';

    await page.waitToBeVisible(`${noteSelector} mat-icon`, 10);
    page.getElByCss(`${noteSelector} mat-icon`).click();

    await page.waitToBeVisible('.cdk-overlay-container .mat-menu-panel .mat-menu-content button:nth-child(1)', 10);
    page.getElByCss('.cdk-overlay-container .mat-menu-panel .mat-menu-content button:nth-child(1)').click();

    await page.waitToBeVisible(`${noteSelector} .mat-expansion-panel-content`, 12);
    expect<any>(hasClass(page.getElByCss(noteSelector), 'mat-expanded')).toBe(true);

    done();
  });

  it('should redirect to note edit on click on edit menu', async (done) => {
    await page.disableFirebaseSync();
    await page.createNumberedNote(0);
    await page.createLoremIpsumNote(); // Test expands this one
    await page.createNumberedNote(1);
    await page.waitForListToBePresent();

    expect<any>(page.getAllElByCss('mat-expansion-panel').count()).toBe(3);

    const noteSelector = 'mat-accordion mat-expansion-panel:nth-child(2)';

    await page.waitToBeVisible(`${noteSelector} mat-icon`, 10);
    page.getElByCss(`${noteSelector} mat-icon`).click();

    await page.waitToBeVisible('.cdk-overlay-container .mat-menu-panel .mat-menu-content button:nth-child(2)', 10);
    page.getElByCss('.cdk-overlay-container .mat-menu-panel .mat-menu-content button:nth-child(2)').click();

    await page.waitToBeVisible('app-note-form', 12);
    expect<any>(page.getCurrentUrl(false)).toMatch(/\/notes\/[A-Za-z0-9\-]+\/edit/);

    done();
  });

  it('does not remove notes on reload', async (done) => {
    await page.disableFirebaseSync();
    await page.createNumberedNote(0);
    await page.createNumberedNote(1);
    await page.createNumberedNote(2);
    await page.waitForListToBePresent();

    expect<any>(page.getAllElByCss('mat-expansion-panel').count()).toBe(3);

    page.navigateTo('/notes');

    await page.waitForListToBePresent();
    expect<any>(page.getAllElByCss('mat-expansion-panel').count()).toBe(3);

    done();
  });

  it('updates list on note remove', async (done) => {
    await page.disableFirebaseSync();
    await page.createNumberedNote(0);
    await page.createNumberedNote(1);
    await page.createNumberedNote(2);
    await page.waitForListToBePresent();

    expect<any>(page.getAllElByCss('mat-expansion-panel').count()).toBe(3);

    const noteSelector = 'mat-accordion mat-expansion-panel:nth-child(2)';

    await page.waitToBeVisible(`${noteSelector} mat-icon`, 10);
    page.getElByCss(`${noteSelector} mat-icon`).click();

    await page.waitToBeVisible('.cdk-overlay-container .mat-menu-panel .mat-menu-content button:nth-child(3)', 10);
    page.getElByCss('.cdk-overlay-container .mat-menu-panel .mat-menu-content button:nth-child(3)').click();

    browser.switchTo().alert().accept();

    await page.waitToBeAbsent('mat-accordion mat-expansion-panel:nth-child(3)', 7);

    expect<any>(page.getAllElByCss('mat-expansion-panel').count()).toBe(2);

    done();
  });

  it('updates search index on note remove', async (done) => {
    await page.disableFirebaseSync();
    await page.createNumberedNote(0);
    await page.createNumberedNote(1);
    await page.createLoremIpsumNote();
    await page.waitForListToBePresent();

    expect<any>(page.getAllElByCss('mat-expansion-panel').count()).toBe(3);

    const noteSelector = 'mat-accordion mat-expansion-panel:nth-child(2)';

    await page.waitToBeVisible(`${noteSelector} mat-icon`, 10);
    page.getElByCss(`${noteSelector} mat-icon`).click();

    await page.waitToBeVisible('.cdk-overlay-container .mat-menu-panel .mat-menu-content button:nth-child(3)', 10);
    page.getElByCss('.cdk-overlay-container .mat-menu-panel .mat-menu-content button:nth-child(3)').click();

    browser.switchTo().alert().accept();

    await page.waitToBeAbsent('mat-accordion mat-expansion-panel:nth-child(3)', 7);

    page.fillField('#search-box', 'title');

    await page.waitToBeAbsent('mat-accordion mat-expansion-panel:nth-child(2)', 6);

    expect<any>(page.getAllElByCss('mat-expansion-panel').count()).toBe(1);

    done();
  });

  it('updates search index on note edit', async (done) => {
    await page.disableFirebaseSync();
    await page.createNumberedNote(0);
    await page.createNumberedNote(1);
    await page.createLoremIpsumNote();
    await page.waitForListToBePresent();

    expect<any>(page.getAllElByCss('mat-expansion-panel').count()).toBe(3);

    const noteSelector = 'mat-accordion mat-expansion-panel:nth-child(2)';

    await page.waitToBeVisible(`${noteSelector} mat-icon`, 10);
    page.getElByCss(`${noteSelector} mat-icon`).click();

    await page.waitToBeVisible('.cdk-overlay-container .mat-menu-panel .mat-menu-content button:nth-child(2)', 10);
    page.getElByCss('.cdk-overlay-container .mat-menu-panel .mat-menu-content button:nth-child(2)').click();

    await page.waitToBeVisible('app-note-form', 12);

    page.fillField(page.getNoteTitleInputSelector(), 'Lorem');
    page.fillField(page.getNoteBodyTextareaSelector(), 'Ipsum');
    await page.waitForElementToBeClickable(page.getNoteSubmitSelector(), 5);
    page.getElByCss(page.getNoteSubmitSelector()).click();

    await page.waitForListToBePresent();

    page.fillField('#search-box', 'title');

    await page.waitToBeAbsent('mat-accordion mat-expansion-panel:nth-child(2)', 6);

    expect<any>(page.getAllElByCss('mat-expansion-panel').count()).toBe(1);

    done();
  });
});

