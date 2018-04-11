import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { configureComponentTestBed } from '../../../test-utils';

import { StreamEmbedComponent } from './stream-embed.component';

describe('StreamEmbedComponent', () => {
  let component: StreamEmbedComponent;
  let fixture: ComponentFixture<StreamEmbedComponent>;

  beforeEach(async(() => {
    configureComponentTestBed(TestBed, StreamEmbedComponent);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamEmbedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
