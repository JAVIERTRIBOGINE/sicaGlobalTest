import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultilanguageComponent } from './multi-language.component';

describe('LoginComponent', () => {
  let component: MultilanguageComponent;
  let fixture: ComponentFixture<MultilanguageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultilanguageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultilanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
