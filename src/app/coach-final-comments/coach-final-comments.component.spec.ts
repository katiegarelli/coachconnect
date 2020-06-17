import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachFinalCommentsComponent } from './coach-final-comments.component';

describe('CoachFinalCommentsComponent', () => {
  let component: CoachFinalCommentsComponent;
  let fixture: ComponentFixture<CoachFinalCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachFinalCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachFinalCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
