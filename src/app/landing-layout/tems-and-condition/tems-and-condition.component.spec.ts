import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemsAndConditionComponent } from './tems-and-condition.component';

describe('TemsAndConditionComponent', () => {
  let component: TemsAndConditionComponent;
  let fixture: ComponentFixture<TemsAndConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemsAndConditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemsAndConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
