import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamEmbedComponent } from './stream-embed.component';

describe('StreamEmbedComponent', () => {
  let component: StreamEmbedComponent;
  let fixture: ComponentFixture<StreamEmbedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamEmbedComponent ]
    })
    .compileComponents();
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
