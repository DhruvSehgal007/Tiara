import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddDiffuserPage } from './add-diffuser.page';

describe('AddDiffuserPage', () => {
  let component: AddDiffuserPage;
  let fixture: ComponentFixture<AddDiffuserPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDiffuserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
