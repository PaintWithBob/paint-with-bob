import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { configureComponentTestBed } from '../../../test-utils';

import { CanvasComponent } from './canvas.component';

fdescribe('CanvasComponent', () => {
  let component: CanvasComponent;
  let fixture: ComponentFixture<CanvasComponent>;

  beforeEach(async(() => {
    configureComponentTestBed(TestBed, CanvasComponent);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
