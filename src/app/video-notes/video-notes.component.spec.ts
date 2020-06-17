import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoNotesComponent } from './video-notes.component';

describe('VideoNotesComponent', () => {
  let component: VideoNotesComponent;
  let fixture: ComponentFixture<VideoNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
