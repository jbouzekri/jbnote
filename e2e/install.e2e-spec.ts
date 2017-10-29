import { InstallPage } from './install.po';
import { CommonTools, hasClass } from './common.po';
import { browser } from 'protractor';

describe('jbnote Install', () => {
  let page: InstallPage;

  beforeEach(() => {
    page = new InstallPage();
  });

  afterEach(function() {
    page.clear();
    browser.waitForAngularEnabled(true);
  });

  it('should redirect to notes pages with sync disabled if i don\'t want sync', () => {
    page.navigateTo('/install');
    page.disableSync();

    expect<any>(page.getCurrentUrl(false)).toEqual('/notes');
    expect<any>(page.getSyncStatusIcon()).toEqual('sync_disabled');
  });

  it('should displays configure sync step if i want sync', async (done) => {
    await page.goToConfigSyncStep();
    expect<any>(page.getInstallStep(0).getAttribute('ng-reflect-selected')).toEqual('false');
    expect<any>(page.getInstallStep(1).getAttribute('ng-reflect-selected')).toEqual('true');
    done();
  });

  it('should displays enable sync step if i go back from config sync', async (done) => {
    await page.goToConfigSyncStep();
    await page.waitToBeVisible('form button[type="button"]', 5);
    page.getElByCss('form button[type="button"]').click();
    await page.waitToBeVisible('app-enable-sync', 15);
    expect<any>(page.getInstallStep(0).getAttribute('ng-reflect-selected')).toEqual('true');
    expect<any>(page.getInstallStep(1).getAttribute('ng-reflect-selected')).toEqual('false');
    done();
  });

  it('should have all standard fields required in config sync form', async (done) => {
    await page.goToConfigSyncStep();
    expect<any>(hasClass(page.getElByCss('#mat-input-0'), 'ng-invalid')).toBe(true);
    expect<any>(hasClass(page.getElByCss('#mat-input-1'), 'ng-invalid')).toBe(true);
    expect<any>(hasClass(page.getElByCss('#mat-input-2'), 'ng-invalid')).toBe(true);
    expect<any>(hasClass(page.getElByCss('#mat-input-3'), 'ng-invalid')).toBe(true);
    done();
  });

  it('should have the auth part hidden per default', async (done) => {
    await page.goToConfigSyncStep();
    expect<any>(page.getElByCss('#mat-slide-toggle-1 input').getAttribute('checked')).toBe(null);
    expect<any>(page.getElByCss('#mat-input-4').isPresent()).toBe(false);
    expect<any>(page.getElByCss('#mat-input-5').isPresent()).toBe(false);
    done();
  });

  it('should displays the auth part on enable auth', async (done) => {
    await page.goToConfigSyncStep();
    page.getElByCss('mat-slide-toggle').click();
    expect<any>(page.getElByCss('#mat-input-4').isPresent()).toBe(true);
    expect<any>(page.getElByCss('#mat-input-5').isPresent()).toBe(true);
    expect<any>(hasClass(page.getElByCss('#mat-input-4'), 'ng-invalid')).toBe(true);
    expect<any>(hasClass(page.getElByCss('#mat-input-5'), 'ng-invalid')).toBe(true);
    done();
  });

  it('should apply correct validation rules to fields', async (done) => {
    await page.goToConfigSyncStep();

    const apiKeyField = page.fillField('#mat-input-0', 'invalid@ApiKey');
    expect<any>(hasClass(apiKeyField, 'ng-invalid')).toBe(true);
    const apiKeyErrorSelector = 'app-config-sync form mat-form-field:nth-child(1) mat-error';
    await page.waitToBePresent(apiKeyErrorSelector, 1);
    expect<any>(page.getElByCss(apiKeyErrorSelector).getText()).toBe('Please enter a valid apiKey');

    const authDomainField = page.fillField('#mat-input-1', 'invalid@authDomain');
    expect<any>(hasClass(authDomainField, 'ng-invalid')).toBe(true);
    const authDomainErrorSelector = 'app-config-sync form mat-form-field:nth-child(2) mat-error';
    await page.waitToBePresent(authDomainErrorSelector, 1);
    expect<any>(page.getElByCss(authDomainErrorSelector).getText()).toBe('Please enter a valid authDomain');

    const databaseURLField = page.fillField('#mat-input-2', 'invalid@databaseURL');
    expect<any>(hasClass(databaseURLField, 'ng-invalid')).toBe(true);
    const databaseURLErrorSelector = 'app-config-sync form mat-form-field:nth-child(3) mat-error';
    await page.waitToBePresent(databaseURLErrorSelector, 1);
    expect<any>(page.getElByCss(databaseURLErrorSelector).getText()).toBe('Please enter a valid databaseURL');

    const storageBucketField = page.fillField('#mat-input-3', 'invalid@storageBucket');
    expect<any>(hasClass(storageBucketField, 'ng-invalid')).toBe(true);
    const storageBucketErrorSelector = 'app-config-sync form mat-form-field:nth-child(4) mat-error';
    await page.waitToBePresent(storageBucketErrorSelector, 1);
    expect<any>(page.getElByCss(storageBucketErrorSelector).getText()).toBe('Please enter a valid storageBucket');

    expect<any>(page.getElByCss('form button[type="submit"]').getAttribute('disabled')).toBe('true');

    done();
  });

  it('should enable submit button and redirect to notes if form is valid', async (done) => {
    browser.waitForAngularEnabled(false);

    await page.goToConfigSyncStep();

    const apiKeyField = page.fillField('#mat-input-0', 'thisisavalidkey');
    expect<any>(hasClass(apiKeyField, 'ng-invalid')).toBe(false);

    const authDomainField = page.fillField('#mat-input-1', 'somekey-98712.firebaseapp.com');
    expect<any>(hasClass(authDomainField, 'ng-invalid')).toBe(false);

    const databaseURLField = page.fillField('#mat-input-2', 'https://somekey-87641.firebaseio.com');
    expect<any>(hasClass(databaseURLField, 'ng-invalid')).toBe(false);

    const storageBucketField = page.fillField('#mat-input-3', 'somekey-03257.appspot.com');
    expect<any>(hasClass(storageBucketField, 'ng-invalid')).toBe(false);

    expect<any>(page.getElByCss('form button[type="submit"]').getAttribute('disabled')).toBe(null);

    page.getElByCss('mat-slide-toggle').click();

    expect<any>(page.getElByCss('form button[type="submit"]').getAttribute('disabled')).toBe('true');

    page.fillField('#mat-input-4', 'myusername');
    page.fillField('#mat-input-5', 'mypassword');

    expect<any>(page.getElByCss('form button[type="submit"]').getAttribute('disabled')).toBe(null);

    page.getElByCss('form button[type="submit"]').click();

    await page.waitToBePresent('app-note-list', 15);

    expect<any>(page.getCurrentUrl(false)).toEqual('/notes');

    expect<any>(page.getSyncStatusIcon()).toEqual('sync_problem');

    done();
  });

  it('should redirect to notes with sync valid if form is valid with valid data', async (done) => {
    browser.waitForAngularEnabled(false);

    const [ apiKey, authDomain, databaseURL, storageBucket, username, password ] = CommonTools.getFirebaseValidConf(true);

    await page.goToConfigSyncStep();

    page.fillField('#mat-input-0', apiKey);
    page.fillField('#mat-input-1', authDomain);
    page.fillField('#mat-input-2', databaseURL);
    page.fillField('#mat-input-3', storageBucket);

    page.getElByCss('mat-slide-toggle').click();

    page.fillField('#mat-input-4', username);
    page.fillField('#mat-input-5', password);

    page.getElByCss('form button[type="submit"]').click();

    await page.waitToBePresent('app-note-list', 15);

    expect<any>(page.getCurrentUrl(false)).toEqual('/notes');

    expect<any>(page.getSyncStatusIcon()).toEqual('sync');

    done();
  });
});

