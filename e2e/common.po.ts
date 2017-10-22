import { browser, by, element, ElementArrayFinder, ElementFinder, ExpectedConditions } from 'protractor';
import { Key, promise } from 'selenium-webdriver';

export function hasClass(element: ElementFinder, cls: string): promise.Promise<boolean> {
  return element.getAttribute('class').then(function (classes) {
    return classes.split(' ').indexOf(cls) !== -1;
  });
}

export class CommonTools {
  navigateTo(url: string = '/') {
    return browser.get(url);
  }

  getSyncStatusIcon() {
    return this.getElByCss('app-root app-header mat-toolbar-row > button mat-icon').getText();
  }

  getCurrentUrl(withBase = true) {
    const currentUrl = browser.getCurrentUrl();
    const baseUrl = browser.baseUrl;
    return !withBase ? currentUrl.then((url: string) => url.replace(baseUrl, '')) : currentUrl;
  }

  fillField(selector: string, value: string) {
    const field = this.getElByCss(selector);
    field.clear();
    field.sendKeys(value);
    field.sendKeys(Key.TAB);
    return field;
  }

  protected secondsToMillis(seconds: number) {
    return seconds * 1000;
  }

  protected waitFor(selector: string, seconds: number, cond: Function) {
    const el = this.getElByCss(selector);
    return browser.wait(
      ((ele) => cond(ele))(el),
      this.secondsToMillis(seconds)
    );
  }

  waitForElementToBeClickable(selector: string, seconds: number) {
    return this.waitFor(selector, seconds, (el) => ExpectedConditions.elementToBeClickable(el));
  }

  waitToBePresent(selector: string, seconds: number) {
    return this.waitFor(selector, seconds, (el) => ExpectedConditions.presenceOf(el));
  }

  waitToBeAbsent(selector: string, seconds: number) {
    return this.waitFor(selector, seconds, (el) => ExpectedConditions.not(ExpectedConditions.presenceOf(el)));
  }

  waitToBeVisible(selector: string, seconds: number) {
    return this.waitFor(selector, seconds, (el) => ExpectedConditions.visibilityOf(el));
  }

  waitToNotBeVisible(selector: string, seconds: number) {
    return this.waitFor(selector, seconds, (el) => ExpectedConditions.not(ExpectedConditions.visibilityOf(el)));
  }

  async disableFirebaseSync() {
    this.navigateTo('/notes');
    browser.executeScript('window.localStorage.setItem("app_sync_enabled", "0");');
    this.navigateTo('/notes');
    await this.waitToBeVisible('app-note-list', 1000);
  }

  getFirebaseValidConf(withAuth: boolean = true) {
    const apiKey = process.env.JBNOTE_FB_API_KEY;
    const authDomain = process.env.JBNOTE_FB_AUTH_DOMAIN;
    const databaseURL = process.env.JBNOTE_FB_DATABASE_URL;
    const storageBucket = process.env.JBNOTE_FB_STORAGE_BUCKET;
    const username = process.env.JBNOTE_FB_USERNAME;
    const password = process.env.JBNOTE_FB_PASSWORD;

    if (!apiKey || !authDomain || !databaseURL || !storageBucket) {
      throw Error('Missing firebase env variables for tests');
    }

    if (withAuth && (!username || !password)) {
      throw Error('Missing firebase auth env variables for tests');
    }

    return [ apiKey, authDomain, databaseURL, storageBucket, username, password ];
  }

  async enableFirebaseSync(withAuth: boolean = true) {
    const [ apiKey, authDomain, databaseURL, storageBucket, username, password ] = this.getFirebaseValidConf(withAuth);

    const firebaseConfig = {
      apiKey: apiKey,
      authDomain: authDomain,
      databaseURL: databaseURL,
      storageBucket: storageBucket,
      enableAuth: false,
      username: null,
      password: null
    };

    if (withAuth) {
      firebaseConfig.enableAuth = true;
      firebaseConfig.username = username;
      firebaseConfig.password = password;
    }

    browser.executeScript('window.localStorage.setItem("app_sync_enabled", "1");');
    browser.executeScript('window.localStorage.setItem("app_sync_config", "' + JSON.stringify(firebaseConfig) + '");');
    this.navigateTo('/notes');
  }

  getElByCss(selector: string): ElementFinder {
    return element(by.css(selector));
  }

  getAllElByCss(selector: string): ElementArrayFinder {
    return element.all(by.css(selector));
  }

  clear() {
    browser.executeScript('window.sessionStorage.clear();');
    browser.executeScript('window.localStorage.clear();');
    browser.executeScript('window.indexedDB.deleteDatabase("notes");');
  }

  restart() {
    browser.restart();
  }

  pause() {
    browser.pause();
  }
}
