import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGlobalComponent } from './view-global.component';

describe('ReadingComponent', () => {
  let component: ViewGlobalComponent;
  let fixture: ComponentFixture<ViewGlobalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewGlobalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
