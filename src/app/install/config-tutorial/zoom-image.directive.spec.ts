import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material';
import { OverlayContainer } from '@angular/cdk/overlay';

import { ConfigTutorialComponent } from './config-tutorial.component';
import { ZoomImageDirective, ZoomImageDialogComponent } from './zoom-image.directive';
import { click } from '../../../testing/index';

@NgModule({
  imports: [MatDialogModule],
  exports: [MatDialogModule, ZoomImageDialogComponent, ZoomImageDirective],
  declarations: [ZoomImageDialogComponent, ZoomImageDirective],
  entryComponents: [ZoomImageDialogComponent],
})
class DialogTestModule { }


describe('ZoomImageDirective', () => {
  let overlayContainerElement: HTMLElement;
  let configTutorialFixture: ComponentFixture<ConfigTutorialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DialogTestModule, NoopAnimationsModule],
      declarations: [ConfigTutorialComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {provide: OverlayContainer, useFactory: () => {
          overlayContainerElement = document.createElement('div');
          return {getContainerElement: () => overlayContainerElement };
        }}
      ]
    })

    TestBed.compileComponents();
  }));

  beforeEach(() => {
    configTutorialFixture = TestBed.createComponent(ConfigTutorialComponent);
    configTutorialFixture.detectChanges();
  });

  it('should open a dialog with the tutorial img inside on click', fakeAsync(() => {
    const firstTutorialImage = configTutorialFixture.debugElement.query(By.css('img'));
    click(firstTutorialImage);
    configTutorialFixture.detectChanges();

    const dialogContainerElement = overlayContainerElement.querySelector('mat-dialog-container');
    const zoomDialogImgSrc = dialogContainerElement.querySelector('img').getAttribute('src');
    expect(zoomDialogImgSrc).toBe('../../../assets/install/step1-go-to-console.png');
  }));
});
