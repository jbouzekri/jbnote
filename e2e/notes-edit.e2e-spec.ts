import { NotesPage } from './notes.po';
import { browser } from 'protractor';
import { hasClass } from './common.po';

describe('jbnote Notes Edit', () => {
  let page: NotesPage;

  beforeEach(() => {
    browser.waitForAngularEnabled(false);
    page = new NotesPage();
  });

  afterEach(function() {
    browser.waitForAngularEnabled(true);
    page.restart();
  });

  it('should have all standard fields required in note edit form', async (done) => {
    await page.disableFirebaseSync();
    await page.goToNewNoteForm();

    expect(hasClass(page.getElByCss(page.getNoteTitleInputSelector()), 'ng-invalid')).toBe(true);
    expect(hasClass(page.getElByCss(page.getNoteBodyTextareaSelector()), 'ng-invalid')).toBe(true);
    done();
  });

  it('should enable submit button and redirect to notes list if note edit form is valid', async (done) => {
    await page.disableFirebaseSync();
    await page.goToNewNoteForm();
    await page.createNote('title0', 'body0', false);

    await page.waitForElementToBeClickable(page.getNoteSubmitSelector(), 5);

    const submitButton = page.getElByCss(page.getNoteSubmitSelector());
    expect(submitButton.getAttribute('disabled')).toBe(null);
    submitButton.click();

    await page.waitForListToBePresent();

    expect(page.getAllElByCss('mat-expansion-panel').count()).toBe(1);

    done();
  });

  it('can preview simple content while editing', async (done) => {
    await page.disableFirebaseSync();
    await page.goToNewNoteForm();
    await page.createNote(
      'Titre',
      'Simple contenu avec retour chariot\n\n' +
      'et àaccëênt', false);

    await page.waitForElementToBeClickable(page.getNoteSubmitSelector(), 5);
    await page.gotToPreviewFromNoteEdit();

    expect(page.getElByCss('mat-panel-title').getText()).toBe('Titre');
    const previewBody = page.getElByCss('.mat-expansion-panel-body markdown-to-html').getAttribute('innerHTML');
    expect(previewBody).toContain('<p>Simple contenu avec retour chariot</p>');
    expect(previewBody).toContain('<p>et àaccëênt</p>');

    done();
  });

  it('can preview markdown content while editing', async (done) => {
    await page.disableFirebaseSync();
    await page.goToNewNoteForm();
    await page.createNote(
      'Titre',
      '# titre 1\n\n' +
      '## Titre 2\n\n' +
      '* item1\n' +
      '* item2\n', false);

    await page.waitForElementToBeClickable(page.getNoteSubmitSelector(), 5);
    await page.gotToPreviewFromNoteEdit();

    expect(page.getElByCss('mat-panel-title').getText()).toBe('Titre');

    const previewBody = page.getElByCss('.mat-expansion-panel-body markdown-to-html').getAttribute('innerHTML');
    expect(previewBody).toContain('<h1 id="titre-1">titre 1</h1>');
    expect(previewBody).toContain('<h2 id="titre-2">Titre 2</h2>');
    expect(previewBody).toContain('<ul>');
    expect(previewBody).toContain('<li>item1</li>');
    expect(previewBody).toContain('<li>item2</li>');
    expect(previewBody).toContain('</ul>');

    done();
  });

  it('can preview simple code sample while editing', async (done) => {
    await page.disableFirebaseSync();
    await page.goToNewNoteForm();
    await page.createNote(
      'Titre',
      '```php\n' +
      '$var = "test";\n' +
      '```', false);

    await page.waitForElementToBeClickable(page.getNoteSubmitSelector(), 5);
    await page.gotToPreviewFromNoteEdit();

    expect(page.getElByCss('mat-panel-title').getText()).toBe('Titre');

    const previewBody = page.getElByCss('.mat-expansion-panel-body markdown-to-html').getAttribute('innerHTML');
    expect(previewBody).toContain('<pre class=" language-php"><code class=" language-php">');
    expect(previewBody).toContain('<span class="token variable">$var</span> <span class="token operator">=</span>');
    expect(previewBody).toContain('<span class="token string">"test"</span><span class="token punctuation">;</span>');
    expect(previewBody).toContain('</code></pre>');

    done();
  });
});

