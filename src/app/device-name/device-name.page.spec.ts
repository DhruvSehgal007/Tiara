import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceNamePage } from './device-name.page';

describe('DeviceNamePage', () => {
  let component: DeviceNamePage;
  let fixture: ComponentFixture<DeviceNamePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceNamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
