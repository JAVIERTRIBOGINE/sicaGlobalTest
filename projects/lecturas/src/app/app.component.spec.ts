import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LecturasAppComponent } from './lecturas-app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        LecturasAppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(LecturasAppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'lecturas'`, () => {
    const fixture = TestBed.createComponent(LecturasAppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('lecturas');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(LecturasAppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('lecturas app is running!');
  });
});
