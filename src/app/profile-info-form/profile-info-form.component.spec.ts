import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileInfoFormComponent } from './profile-info-form.component';

describe('ProfileInfoFormComponent', () => {
  let component: ProfileInfoFormComponent;
  let fixture: ComponentFixture<ProfileInfoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileInfoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
