import { browser, by, element } from 'protractor';

import { AppPage } from './app.po';

export class InstallPage extends AppPage {
  disableSync() {
    return element(by.css('#install-disable-sync-btn')).click();
  }

  enableSync() {
    return element(by.css('#install-enable-sync-btn')).click();
  }

  getInstallStep(index: number = 0) {
    return element(by.css(`mat-horizontal-stepper mat-step-header[ng-reflect-index="${index}"]`));
  }
}
