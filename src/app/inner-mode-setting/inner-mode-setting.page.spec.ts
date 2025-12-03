import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InnerModeSettingPage } from './inner-mode-setting.page';

describe('InnerModeSettingPage', () => {
  let component: InnerModeSettingPage;
  let fixture: ComponentFixture<InnerModeSettingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InnerModeSettingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
