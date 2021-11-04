import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsCollectionsComponent } from './payments-collections.component';

describe('LoginComponent', () => {
  let component: PaymentsCollectionsComponent;
  let fixture: ComponentFixture<PaymentsCollectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentsCollectionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
