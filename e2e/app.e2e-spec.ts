import { AppPage } from './app.po';

describe('jbnote App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  afterEach(function() {
    page.clear();
  });

  it('should display installation page on startup', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Installation');
    expect(page.getCurrentUrl(false)).toEqual('/install');
  });

  it('should redirect to installation page if install not finished', () => {
    page.navigateTo('/notes');
    expect(page.getParagraphText()).toEqual('Installation');
    expect(page.getCurrentUrl(false)).toEqual('/install');

    page.navigateTo('/notes/new');
    expect(page.getParagraphText()).toEqual('Installation');
    expect(page.getCurrentUrl(false)).toEqual('/install');

    page.navigateTo('/notes/1/edit');
    expect(page.getParagraphText()).toEqual('Installation');
    expect(page.getCurrentUrl(false)).toEqual('/install');
  });
});
