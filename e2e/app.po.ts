import { CommonTools } from './common.po';

export class AppPage extends CommonTools {
  getParagraphText() {
    return this.getElByCss('app-root h1').getText();
  }
}
