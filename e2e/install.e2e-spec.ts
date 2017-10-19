import { InstallPage } from './install.po';

describe('jbnote Install', () => {
  let page: InstallPage;

  beforeEach(() => {
    page = new InstallPage();
  });

  afterEach(function() {
    page.clear();
  });

  it('should redirect to notes pages with sync disabled if i don\'t want sync', () => {
    page.navigateTo('/install');
    page.disableSync();

    expect(page.getCurrentUrl(false)).toEqual('/notes');
    expect(page.getSyncStatusIcon()).toEqual('sync_disabled');
  });

  it('should displays configure sync step if i want sync', async (done) => {
    page.navigateTo('/install');
    page.enableSync();
    await page.waitToBeVisible('app-config-sync', 1000);
    expect(page.getInstallStep(0).getAttribute('ng-reflect-selected')).toEqual('false');
    expect(page.getInstallStep(1).getAttribute('ng-reflect-selected')).toEqual('true');
    done();
  });
});

