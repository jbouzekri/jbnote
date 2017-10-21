import { CommonTools } from './common.po';

export class InstallPage extends CommonTools {
  enableSync() {
    return this.getElByCss('#install-enable-sync-btn').click();
  }

  disableSync() {
    return this.getElByCss('#install-disable-sync-btn').click();
  }

  async goToConfigSyncStep() {
    this.navigateTo('/install');
    this.enableSync();
    await this.waitToBeVisible('app-config-sync', 1000);
    await this.waitToBePresent('#mat-input-0', 1000);
  }

  getInstallStep(index: number = 0) {
    return this.getElByCss(`mat-horizontal-stepper mat-step-header[ng-reflect-index="${index}"]`);
  }
}
