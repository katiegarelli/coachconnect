import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyVideosListComponent } from './my-videos-list.component';

describe('MyVideosListComponent', () => {
  let component: MyVideosListComponent;
  let fixture: ComponentFixture<MyVideosListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyVideosListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyVideosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
