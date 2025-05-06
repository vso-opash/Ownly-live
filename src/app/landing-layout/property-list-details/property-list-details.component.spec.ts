import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyListDetailsComponent } from './property-list-details.component';

describe('PropertyListDetailsComponent', () => {
  let component: PropertyListDetailsComponent;
  let fixture: ComponentFixture<PropertyListDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PropertyListDetailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyListDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
