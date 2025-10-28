import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectBluetoothPage } from './select-bluetooth.page';

describe('SelectBluetoothPage', () => {
  let component: SelectBluetoothPage;
  let fixture: ComponentFixture<SelectBluetoothPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectBluetoothPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
