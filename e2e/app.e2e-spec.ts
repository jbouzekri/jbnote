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
    expect<any>(page.getParagraphText()).toEqual('Installation');
    expect<any>(page.getCurrentUrl(false)).toEqual('/install');
  });

  it('should redirect to installation page if install not finished', () => {
    page.navigateTo('/notes');
    expect<any>(page.getParagraphText()).toEqual('Installation');
    expect<any>(page.getCurrentUrl(false)).toEqual('/install');

    page.navigateTo('/notes/new');
    expect<any>(page.getParagraphText()).toEqual('Installation');
    expect<any>(page.getCurrentUrl(false)).toEqual('/install');

    page.navigateTo('/notes/1/edit');
    expect<any>(page.getParagraphText()).toEqual('Installation');
    expect<any>(page.getCurrentUrl(false)).toEqual('/install');
  });
});
