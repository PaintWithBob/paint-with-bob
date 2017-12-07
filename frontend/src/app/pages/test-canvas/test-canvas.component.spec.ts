import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCanvasComponent } from './test-canvas.component';

describe('TestCanvasComponent', () => {
  let component: TestCanvasComponent;
  let fixture: ComponentFixture<TestCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
