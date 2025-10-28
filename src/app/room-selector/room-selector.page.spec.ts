import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoomSelectorPage } from './room-selector.page';

describe('RoomSelectorPage', () => {
  let component: RoomSelectorPage;
  let fixture: ComponentFixture<RoomSelectorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomSelectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
