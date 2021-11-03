import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteGlobalComponent } from './delete-global.component';

describe('ReadingComponent', () => {
  let component: DeleteGlobalComponent;
  let fixture: ComponentFixture<DeleteGlobalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteGlobalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
