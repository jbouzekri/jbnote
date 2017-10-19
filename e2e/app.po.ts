import { browser, by, element, ExpectedConditions } from 'protractor';

export class AppPage {
  navigateTo(url: string = '/') {
    return browser.get(url);
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }

  getSyncStatusIcon() {
    return element(by.css('app-root app-header mat-toolbar-row > button mat-icon')).getText();
  }

  getCurrentUrl(withBase = true) {
    const currentUrl = browser.getCurrentUrl();
    const baseUrl = browser.baseUrl;
    return !withBase ? currentUrl.then((url: string) => url.replace(baseUrl, '')) : currentUrl;
  }

  protected secondsToMillis(seconds: number) {
    return seconds * 1000;
  }

  waitToBeVisible(selector: string, seconds: number) {
    const el = element(by.css(selector));
    return browser.wait(
      ExpectedConditions.visibilityOf(el),
      this.secondsToMillis(seconds),
      'The element \'' + el.locator() + '\' did not appear within ' + seconds + ' seconds.'
    );
  }

  waitToNotBeVisible(selector: string, seconds: number) {
    const el = element(by.css(selector));
    return browser.wait(
      ExpectedConditions.not(ExpectedConditions.visibilityOf(el)),
      this.secondsToMillis(seconds),
      'The element \'' + el.locator() + '\' still appeared within ' + seconds + ' seconds.'
    );
  }

  clear() {
    browser.executeScript('window.sessionStorage.clear();');
    browser.executeScript('window.localStorage.clear();');
  }

  pause() {
    browser.pause();
  }
}
