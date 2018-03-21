import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAccountPopupComponent } from './delete-account-popup.component';

describe('DeleteAccountPopupComponent', () => {
  let component: DeleteAccountPopupComponent;
  let fixture: ComponentFixture<DeleteAccountPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteAccountPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteAccountPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
