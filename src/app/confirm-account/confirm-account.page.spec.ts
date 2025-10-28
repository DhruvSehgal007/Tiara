import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmAccountPage } from './confirm-account.page';

describe('ConfirmAccountPage', () => {
  let component: ConfirmAccountPage;
  let fixture: ComponentFixture<ConfirmAccountPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
