import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorCardComponent } from './error-card.component';
import { MatCardModule } from '@angular/material/card';

describe('ErrorCardComponent (TestBed)', () => {
  let fixture: ComponentFixture<ErrorCardComponent>;
  let component: ErrorCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ErrorCardComponent,
        MatCardModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorCardComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the error message when provided', () => {
    const message = 'Une erreur est survenue';
    component.error = message;

    fixture.detectChanges();

    const content: HTMLElement | null =
      fixture.nativeElement.querySelector('mat-card-content');

    expect(content?.textContent?.trim()).toBe(message);
  });

  it('should render empty content when error is null', () => {
    component.error = null;

    fixture.detectChanges();

    const content: HTMLElement | null =
      fixture.nativeElement.querySelector('mat-card-content');

    expect(content?.textContent?.trim()).toBe('');
  });

  it('should contain a mat-card element', () => {
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('mat-card');
    expect(card).not.toBeNull();
  });
});
