import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BluetoothListsPage } from './bluetooth-lists.page';

describe('BluetoothListsPage', () => {
  let component: BluetoothListsPage;
  let fixture: ComponentFixture<BluetoothListsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BluetoothListsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
