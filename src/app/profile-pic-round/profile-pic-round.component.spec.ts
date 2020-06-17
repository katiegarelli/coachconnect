import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePicRoundComponent } from './profile-pic-round.component';

describe('ProfilePicRoundComponent', () => {
  let component: ProfilePicRoundComponent;
  let fixture: ComponentFixture<ProfilePicRoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilePicRoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePicRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
