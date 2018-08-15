import { RotoProsWebPage } from './app.po';

describe('roto-pros-web App', () => {
  let page: RotoProsWebPage;

  beforeEach(() => {
    page = new RotoProsWebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
