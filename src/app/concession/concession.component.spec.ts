import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcessionComponent } from './concession.component';

describe('HomeComponent', () => {
  let component: ConcessionComponent;
  let fixture: ComponentFixture<ConcessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConcessionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
