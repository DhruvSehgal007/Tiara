import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InnerModePage } from './inner-mode.page';

describe('InnerModePage', () => {
  let component: InnerModePage;
  let fixture: ComponentFixture<InnerModePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InnerModePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
