import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraderLandingComponent } from './trader-landing.component';

describe('TraderLandingComponent', () => {
  let component: TraderLandingComponent;
  let fixture: ComponentFixture<TraderLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraderLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraderLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
